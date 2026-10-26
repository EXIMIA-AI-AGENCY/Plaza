# Matching: how PLAZA picks the best option for a buyer

The buyer does not want a list. They want the best business for what they need, with alternatives if the best does not fit their budget or schedule. The reference match engine lives in `packages/match`. It is deterministic (no model involved), public, versioned, and explainable: every result carries the score per dimension and a one-line reason.

## Inputs

1. The buyer's need, structured by Muse from the conversation: category, description, time window, location, `max_price`, `priority` (`price`, `quality`, `speed`, `balanced`), `constraints[]` (closed vocabulary: `lang:es`, `lang:en`, `pets`, `accessible`, `invoice_required`, `female_provider`, `same_day`, ...).
2. The real quotes received from the `inquire` step (price, available slot, conditions), one per candidate node.
3. The reputation summary of each node from the index.
4. The median price of the category in the area, computed by the index from recent verified receipts (falls back to the median of the quotes received when the index has fewer than 10 receipts for that category and area).

## Three dimensions, each scored 0 to 1

### price

```
r = quote.total / reference
reference = min(max_price, median_area)   if max_price given
          = median_area                    otherwise

price_score = 1.0                 if r <= 0.8
            = 1.0 - (r - 0.8)     if 0.8 < r <= 1.3   (linear, 1.0 at 0.8 down to 0.5 at 1.3)
            = max(0, 0.5 - (r - 1.3) * 1.5)   if r > 1.3  (reaches 0 at r = 1.63)

penalty: if quote.total < 0.5 * median_area, price_score = price_score * 0.6
         (suspiciously cheap is a risk signal, not a win)
```

### reputation

```
verified   = number of verified receipts, each weighted by exp(-age_days / 365)
rating     = average review rating (1 to 5) over verified reviews, Bayesian-smoothed:
             (sum_ratings + 4.2 * 3) / (count + 3)      (prior of 4.2 with weight 3)
disputes   = open_disputes / max(verified_receipts, 1)
response   = inquiries answered within 10 minutes / inquiries received (last 90 days)
fulfilled  = receipts without dispute / receipts

volume     = min(1, log10(1 + verified) / log10(51))   (50 verified receipts saturates)
quality    = (rating - 1) / 4
reputation_score = 0.35 * volume + 0.35 * quality + 0.15 * response + 0.15 * fulfilled
                   - 0.5 * disputes   (clamped to [0, 1])

new node (0 verified receipts): reputation_score = 0.5, label "new"
```

### fit

```
window      = 1.0 if the quoted slot is inside the buyer's window, else 0
                for priority = speed: 1.0 for the earliest slot, decreasing linearly to 0.4 at the end of the window
area        = 1.0 if the buyer's location is inside the node's service area, else 0  (hard filter in practice)
constraints = satisfied_constraints / total_constraints   (1.0 when none given)
offer       = 1.0 if offer category == requested category, 0.7 if same parent category, else 0

fit_score = 0.4 * window + 0.2 * area + 0.2 * constraints + 0.2 * offer
```

## Weights by priority

| priority | price | reputation | fit |
| --- | --- | --- | --- |
| balanced | 0.35 | 0.40 | 0.25 |
| price | 0.55 | 0.25 | 0.20 |
| quality | 0.15 | 0.60 | 0.25 |
| speed | 0.20 | 0.30 | 0.50 |

```
score = w_price * price_score + w_reputation * reputation_score + w_fit * fit_score
```

## Output

- `best`: the highest score.
- `alternatives`: up to 3 more, chosen to be different from `best` and from each other: the cheapest acceptable, the fastest acceptable, the highest reputation acceptable. "Acceptable" means fit_score >= 0.6 and no open-dispute warning.
- Each entry carries `score`, the three sub-scores, the raw facts (price, slot, verified receipts, rating, dispute rate) and `reason`, a one-line human explanation. Muse turns the structured output into language; the numbers never come from a model.

Example output, rendered by Muse:

> Best: Plomería Rivera, $150 at 4:30 PM, 48 verified jobs, 4.9. Cheaper: Tuberías Ortiz, $110 at 6:00 PM, 12 jobs, 4.6. Fastest: Fontanería Caguas, $160 in 1 hour, 20 jobs, 4.7.

When `best` is above `max_price`, the gateway says so and offers two paths: negotiate with `best` (within the owner's `max_discount_pct`) or close with the best alternative inside budget.

## Hard rules

- Nothing in this file reads payments to PLAZA, to an index, or to anyone. Paid placement is a protocol violation.
- Diversity: the top 3 are never from the same owner.
- Nodes with `unverified` receipts or an open dispute rate above 20% get a visible warning and the dispute penalty; they are never hidden.
- Every change to weights or formulas bumps `MATCH_VERSION` in `packages/match/src/version.ts` and updates the fixed scenarios in `packages/match/test/scenarios`. The build fails otherwise.
- The buyer agent must be able to show the buyer the breakdown on request.

## Non-goals in v0.1

Personalization per buyer (learned preferences), collaborative filtering, and learned ranking models. If they ever come, they come as an opt-in layer on top of this public baseline, and the baseline stays available.
