# @plaza/muse

The only module in PLAZA that talks to models. Everything at runtime is Muse:

- `chat()`: Muse Spark Open on Baseten or Modal (default), Muse Spark 1.3 or Muse Wonder on Meta Model API (`https://api.meta.ai/v1`, Responses or Chat Completions). Selected by `PLAZA_MODEL_PROVIDER`.
- `transcribe()`: Muse Voice Transcribe.
- `segment()`: SAM 3.1 (images and video frames).

No other provider SDK is allowed in production code. CI greps for `@anthropic-ai`, `openai`, `@google` imports outside this package and fails.

Arrives day 2 (EXI-722 depends on it for onboarding) and is completed on day 4 (EXI-728).
