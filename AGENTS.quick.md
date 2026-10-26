# PLAZA: quick rules

Read `AGENTS.md` first. It is the operating brief for this repo: mission, hackathon dates, architecture, protocol summary, stack conventions, security rules, the 10-day plan with Linear issue ids, and the definition of done.

Quick rules:
- Protocol spec is the source of truth: `docs/protocol/v0.1.md` and `packages/spec/schemas`.
- All runtime AI is Muse. Negotiation, intent structuring, transcription, vision, explanations, quote and agreement generation: Muse Spark Open (Baseten/Modal), Muse Spark and Muse Wonder (Meta Model API), Muse Voice Transcribe, SAM 3.1. No other model provider SDK in production code; every model call goes through `packages/muse`.
- The model proposes, the deterministic validator decides. Never let model output bypass the owner's policy.
- Everything signed. Anything that fails schema or signature validation is rejected.
- Zero commission, zero paid ranking. PLAZA never moves money.
- Code in English, UI in Spanish (i18n-ready). No em dashes in UI text or documents.
- One PR per Linear issue (EXI-718 to EXI-738), tests for every acceptance criterion, CI green before merge.
