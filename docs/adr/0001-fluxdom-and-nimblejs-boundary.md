# ADR-0001: Keep FluxDOM and NimbleJS independently versioned

## Status

Accepted on 2026-07-19.

## Context

NimbleJS is a framework-agnostic state toolkit with an object-based API, stores,
history, and persistence. FluxDOM separately contains a tuple-based signal
runtime designed as a compiler target. Their primitive concepts overlap, but
both APIs and their performance requirements remain experimental.

## Decision drivers

- NimbleJS must not require a renderer, compiler, or browser DOM.
- FluxDOM needs freedom to co-design generated output and runtime helpers.
- Shared reactivity language should map to observable behavior.
- A future integration should follow usage data and benchmarks.

## Considered options

We considered making NimbleJS FluxDOM's runtime, copying NimbleJS into FluxDOM,
and keeping independently versioned implementations with shared semantics. The
first two options create premature API coupling or guaranteed source drift.

## Decision

NimbleJS remains independently versioned and does not import FluxDOM. FluxDOM
does not adopt NimbleJS as its runtime while either public API is pre-1.0.

Both repositories independently test this conceptual boundary:

1. Signal reads inside an effect subscribe it.
2. Effects remove dependencies not read on their latest run.
3. Stopping an effect prevents future runs and performs final cleanup once.
4. Computed values notify their consumers when their value changes.
5. Nested batches coalesce writes and flush once at the outer boundary.
6. `Object.is`-equal writes do not notify consumers.

This is not API or binary compatibility. Any adapter must be an explicit,
separately tested package.

## Consequences

NimbleJS stays small and portable, and both projects can evolve independently.
The trade-off is duplicate low-level work and the need to keep semantic tests
honest. A new ADR may propose an adapter or shared core after real usage,
benchmarks, bundle-cost analysis, and a migration path exist.
