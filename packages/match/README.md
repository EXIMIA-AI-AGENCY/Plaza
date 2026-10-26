# @plaza/match

Deterministic, public, explainable match engine: price, reputation and fit, weighted by the buyer's priority (price, quality, speed, balanced). Returns the best option plus cheapest, fastest and highest-rated alternatives with a one-line reason each. No model involved. Formula in `docs/matching.md`. Fixed scenarios in `test/scenarios` lock the behavior; changing weights without updating them fails the build.

Arrives day 3 (EXI-739).
