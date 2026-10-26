# PLAZA and Meta Business Agent

PLAZA is Business Agent friendly by design: a business that already runs Meta Business Agent on its WhatsApp number keeps it, and PLAZA becomes the backend that Business Agent calls to quote, check availability, hold a slot, issue an agreement, book and request payment. The same node is reachable by buyer agents (Muse) through the index. One calendar, one price list, one receipt log.

## What Meta's documentation says (verified Oct 26, 2026)

From the Meta Business Agent developer documentation (developers.facebook.com/documentation/meta-business-agent):

- Business Agent handles customer conversations on WhatsApp (Instagram Direct and Messenger announced). You configure knowledge (business info, FAQs, websites, files), instructions (tone, priorities) and actions.
- Actions run through the business's own APIs. Meta's own examples are booking an appointment and confirming a payment.
- There is a developer platform with connected systems (your APIs and webhook subscriptions), connector tools, thread control and handoff between the agent and your app.
- How-to guides cover catalog integration with live inventory checks, smart product recommendations from the catalog, multi-item carts, order status, user login and OTP against your own system, interactive messages (buttons, lists, carousels, WhatsApp Flows), and build guides for selling, booking and reservations, support, lead generation and post-purchase.
- Limits: one AI agent per number (a number with another authorized agent integration is blocked); excluded verticals: finance, government, health, alcohol, gambling, over-the-counter drugs, matrimony services; the number must be on the WhatsApp Business Platform (not the consumer app) in an authorized country with a verified account.
- Auth: system user access token with `whatsapp_business_messaging` and `whatsapp_business_management`; `X-API-Version: 2.0.0` for Business Agent Platform endpoints; Solution Partners use a Business Integration System User token.
- Reported pricing: about $2.00 per million tokens on the Business Platform, charged per reply since August 1, 2026; inclusion in some WhatsApp Business Premium tiers announced.
- Meta has signalled a second path where a business runs its own agent on its own infrastructure and connects it to the platform. General availability not confirmed.

Not yet verified (to complete in EXI-740): the exact connector tool schema, the webhook event list, and the thread control payloads. Pages: `reference/configure/connectors`, `reference/configure/connector-tools`, `reference/operate/thread-control-cloud-api`, `reference/operate/agent-event`.

## Three node modes

| Mode | Who answers humans on WhatsApp | Who answers buyer agents | When |
| --- | --- | --- | --- |
| 1. Business Agent | Meta Business Agent, calling PLAZA tools | PLAZA node directly | The business already has Business Agent, or wants it |
| 2. Cloud API | PLAZA node over WhatsApp Cloud API | PLAZA node directly | No Business Agent (small business, excluded vertical, or not on the Business Platform) |
| 3. Automatic | The source system (STR Engine, EXIMIA CRM, gadget proxy) | PLAZA node generated from it | Businesses already running on EXIMIA systems |

A node can move from mode 2 to mode 1 later without losing receipts, reviews or reputation: the node identity stays the same.

## Mode 1: PLAZA as a Business Agent connector

Tools PLAZA exposes to Business Agent (all backed by the same code paths the protocol uses):

| Tool | Input | Output | Protocol equivalent |
| --- | --- | --- | --- |
| `quote` | offer_id or free description, quantity, when | price, conditions, valid_until | `quote`, `quote_document` |
| `check_availability` | offer_id, window | slots | `availability` |
| `hold` | offer_id, slot | held_until | `hold` |
| `issue_agreement` | quote reference | agreement summary, document_url | `agreement` |
| `book` | quote reference, slot, customer contact | booking id | `accept` (recorded as a receipt once paid) |
| `request_payment` | booking id, kind (full, deposit, balance) | checkout_url | `payment_request` |

Rules:

- A booking made through Business Agent and a booking made by a buyer agent through the index block the same slot in the same calendar. No double booking: `hold` and `book` are transactional.
- Receipts are issued the same way regardless of channel, so reputation counts human customers too.
- Handoff: if the deterministic validator rejects a proposed action twice, or the customer asks for a person, PLAZA returns a handoff signal and Business Agent transfers the thread to the owner (thread control).
- The owner's negotiation policy applies to both channels. Business Agent can present the negotiated price; it cannot go below the owner's floor because PLAZA computes it.

## Mode 2: PLAZA over WhatsApp Cloud API

For businesses without Business Agent, the PLAZA node handles intake (voice notes transcribed with Muse Voice Transcribe, structured with Muse Spark), notifications (new quote, deal closed, payment received, review received) and owner commands ("pausa", "sube el precio a 130"). Excluded verticals and businesses on the consumer WhatsApp Business app use this mode. Customer conversations with humans in this mode are kept minimal: PLAZA is not a general chat agent, it is the business's commerce backend and its agent-facing front.

## What PLAZA adds that Business Agent does not have

- Discovery: an index any agent can query. Business Agent waits for someone who already has the number.
- Comparison and matching across many businesses (`docs/matching.md`). Business Agent speaks for one business.
- Structured negotiation between agents within owner-set rules, in parallel.
- Portable, verifiable reputation from signed receipts and reviews, owned by the business.
- Any channel, any industry, any agent, zero per-message fee.

## What Business Agent adds that PLAZA does not do

- A full conversational front for human customers on WhatsApp, Instagram and Messenger, with Meta's interactive message types and Flows.
- Catalog-native product recommendations, carts and order status inside the chat.
- Meta-managed hosting, evaluation tooling and insights for the agent.

The two are complementary. PLAZA treats Business Agent as the best possible WhatsApp front for a node and never competes for the number.
