# PLAZA

**The market with no owner.** An open protocol (Apache 2.0) that lets a person's AI agent, starting with Meta's Muse, search across every business, compare, pick the best one for what that person needs, negotiate, and close: quote, agreement, booking, payment and review. No platform in the middle, no commission, and a ranking nobody can buy.

A plumber in Caguas, a colmado in Utuado, a short-term rental host in Rincón: businesses that live on WhatsApp and have no website, no catalog, no API. PLAZA gives each of them a **node** (an agent that speaks for the business within rules the owner set), lists it in an **index** anyone can run, and turns every closed deal into a **receipt signed by both sides** that becomes portable, verifiable reputation.

> Built in Puerto Rico by [EXIMIA](https://eximiahq.com) for the Meta Global AI Developer Hackathon (Oct 26 to Nov 4, 2026). Startup track, theme "Build for Your World".

## Why

Today a platform charges 15% to 30% to connect a customer with a business. The platform does three things: it finds you (discovery), it makes you trustworthy (reviews), and it charges you (payments). PLAZA replaces all three with open pieces nobody owns, and lets the customer's own agent do the work the platform used to do, including choosing the best option: "the one I recommend charges $150 at 4:30 and has 48 verified jobs; this one is $110 at 6:00 with a 4.6."

All runtime intelligence is Muse: Muse Spark Open on open weights for the nodes, Muse Spark and Muse Wonder through Meta Model API, Muse Voice Transcribe for the owner's voice notes, SAM 3.1 for photos. No other model provider runs in production.

## How it works

```
  owner                              customer
    │ voice note on WhatsApp            │ "I need a plumber today before 5, I have $150"
    │ or Meta Business Agent            ▼
    ▼                              ┌──────────┐  find → inquire (N nodes in parallel) → match → negotiate → book
 ┌──────────┐    manifest    ┌─────│ GATEWAY  │ ◀── Muse
 │   NODE   │ ─────────────▶ │     │(connector)│
 │ (per biz)│ ◀──────────────┤     └──────────┘
 └──────────┘  inquiry/quote │ INDEX (anyone can run one)
    │  availability, hold, quote_document, agreement, counter, accept
    ▼
 payment_request (Stripe Link, ATH Móvil, cash) → receipt signed by both → review signed by the buyer → reputation → next match
```

1. **Node**: the business's agent. Installed in two minutes from WhatsApp (the owner dictates services, prices and rules in a voice note), by connecting an existing Meta Business Agent, from the web (one-click deploy to Vercel), automatically from a CRM or property manager, or on a $50 ESP32 running the Muse Gadgets SDK. It publishes a signed manifest at `/.well-known/plaza.json` with real availability and answers structured messages within the owner's policy: quotes, holds, formal quotations, agreements, payment requests.
2. **Index**: a directory agents can query. Anyone can run one; EXIMIA runs the first. Indexes verify signatures, crawl nodes every 15 minutes, collect receipts and reviews, compute reputation with a public formula, and can federate by exporting manifests to each other.
3. **Match engine**: deterministic, public, explainable ranking by price, reputation and fit with the buyer's need and priority (price, quality, speed, balanced). Returns the best option plus the cheapest, fastest and highest-rated alternatives, each with a reason. Nobody can pay for placement. See [`docs/matching.md`](docs/matching.md).
4. **Gateway**: how Muse (or any agent) enters PLAZA without implementing the protocol. Tools: `find`, `inquire`, `match`, `negotiate`, `book`, `review`, `verify`. Installed as a Muse connector.
5. **Receipts and reviews**: every closed deal is signed by the node and counter-signed by the buyer's agent; only a buyer holding a receipt can leave a review. Both are owned by the business, verifiable by anyone, and are the reputation layer. No tokens, no blockchain.
6. **Business Agent friendly**: a business running Meta Business Agent keeps it. PLAZA becomes its backend for quotes, availability, agreements, bookings and payments, and the open layer through which other people's agents find and hire it. See [`docs/business-agent.md`](docs/business-agent.md).

PLAZA never touches money. Settlement happens outside the protocol (Stripe Link, ATH Móvil, cash) and maps onto ACP and AP2.

## Protocol

Version 0.1 lives in [`docs/protocol/v0.1.md`](docs/protocol/v0.1.md), with JSON Schemas in [`packages/spec/schemas`](packages/spec/schemas) and examples in [`packages/spec/examples`](packages/spec/examples).

Design rules that do not change:

- Everything is signed (Ed25519 over canonical JSON, RFC 8785). Anything that fails schema or signature validation is rejected.
- Negotiation is finite and structured: at most 6 rounds per thread, structured fields only. Free text is limited to a 280-character `note` that is shown to humans and never fed to a model as an instruction.
- The model proposes, a deterministic validator decides. No node can close a deal outside the owner's policy; no buyer agent can accept above the buyer's budget or without the buyer's explicit approval.
- Only buyers with a signed receipt can review. One review per receipt. Reviews belong to the business.
- Zero commission, zero paid ranking, ever. The ranking formula is public and versioned.

## Meta models and products used

| Where | What |
| --- | --- |
| Node negotiation brain | Muse Spark Open (open weights) served on Baseten and Modal |
| Buyer intent, explanations, onboarding, quotations and agreements | Muse Spark 1.3 and Muse Wonder through Meta Model API |
| Owner voice notes (WhatsApp, gadget) | Muse Voice Transcribe |
| Photos of the problem, inventory, property | SAM 3.1 |
| The colmado node | Muse Gadgets SDK on an ESP32 |
| WhatsApp front for businesses that have it | Meta Business Agent Platform (PLAZA as its connector) |
| Distribution | Muse connector platform |
| Development | Muse Code |

Every model call in production goes through `packages/muse`. No other model provider is used at runtime.

Exact usage and file paths are tracked in [`docs/meta-models.md`](docs/meta-models.md).

## Repository

```
packages/spec          JSON Schemas, examples, validation tests
packages/sdk           identity, signing, negotiation client, index client
packages/muse          the only module that calls Muse models (chat, voice, vision)
packages/negotiation   LLM engine + policy validator + model providers
packages/match         deterministic, explainable match engine
packages/ui            design tokens and shared components
apps/node              the business agent (Next.js, multi-tenant)
apps/index             public index, live map, metrics, landing
apps/gateway           Muse connector (MCP + OpenAPI) and playground
apps/gadget            ESP32 node on the Muse Gadgets SDK
examples/              minimal nodes in TypeScript and Python
docs/                  protocol, settlement, guides, hackathon log
```

Stack: Next.js, Vercel, Neon + Drizzle, Better Auth, Inngest, Resend, Stripe, WhatsApp Cloud API, Meta Model API.

## Run a node in 10 minutes

Coming on day 3 of the hackathon. See [`docs/build-a-node.md`](docs/build-a-node.md) and [`examples/node-template`](examples/node-template). If you are building in the Meta hackathon and your project sells anything, you can plug it into Muse through PLAZA in an afternoon.

## Status

Day 1 of 10. Protocol v0.1 drafted with 15 message types, schemas and 33 validation tests passing. Follow the build in [`docs/hackathon/log.md`](docs/hackathon/log.md).

## How EXIMIA makes money

Open core. The protocol, the node, and the index are free. EXIMIA sells hosted nodes, integration with mid-market ERPs and CRMs, SLAs, and EXIMIA CRM with PLAZA built in. Never a commission on a transaction, never a paid ranking.

## License

Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
