# Meta models and products used in PLAZA

Keep this table honest and current. Judges verify it against the code. Rule: all runtime AI is Muse. Every model call goes through `packages/muse`; CI fails on any other provider SDK import in production code.

| Product | Use | Where in the code | Status |
| --- | --- | --- | --- |
| Muse Spark Open (open weights, Baseten / Modal) | Node negotiation brain | `packages/negotiation/src/providers/baseten.ts`, `modal.ts` | planned (D4) |
| Muse Spark 1.3 (Meta Model API) | Onboarding: voice note to structured policy; structuring the buyer's need; turning the match engine's breakdown into a spoken recommendation; negotiation fallback | `packages/muse/src/chat.ts`, `apps/node/lib/meta/extract-policy.ts`, `apps/gateway/lib/intent.ts`, `apps/gateway/lib/explain.ts` | planned (D2, D4) |
| Meta Business Agent Platform | WhatsApp front for businesses that run it; PLAZA registered as its connector with quote, availability, hold, agreement, book and payment tools | `apps/node/adapters/business-agent/*`, `docs/business-agent.md` | planned (D5) |
| Muse Wonder (Meta Model API) | Long-context extraction from menus, price lists and property listings; drafting formal quotations and agreements from templates | `apps/node/lib/meta/extract-offers.ts`, `packages/agreements/src/draft.ts` | planned (D5, D6) |
| Muse Voice Transcribe | Owner voice notes on WhatsApp and on the gadget | `apps/node/lib/meta/transcribe.ts` | planned (D2) |
| SAM 3.1 | Segment products in inventory photos and rooms in property photos | `apps/node/lib/meta/sam.ts` | planned (D5, drop if out of time) |
| Muse Gadgets SDK | ESP32 colmado node | `apps/gadget/` | planned (D6) |
| Muse connector platform | PLAZA gateway as a custom connector and public listing | `apps/gateway/`, `docs/muse/connector.md` | planned (D2, D4) |
| Muse Code | Used to build this repo | `docs/muse-code.md` | ongoing |
