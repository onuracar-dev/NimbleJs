# Changelog

This project follows Semantic Versioning. Before 1.0, a minor release may change experimental APIs.

## 0.2.0 - 2026-07-19

### Added

- Nested `batch` transactions that coalesce affected effects.
- Optional effect schedulers and deterministic cleanup behavior.
- Disposable computed values.
- Bounded undo/redo history and persistence edge-case coverage.
- ESM and CommonJS consumer builds, package exports, and declarations.
- Architecture decision record for the FluxDOM/NimbleJS boundary.
- CI, security, contribution, website, and package-content checks.

### Changed

- Signal equality follows `Object.is` semantics.
- Raw store updates notify observers as one batched operation.
- The project is explicitly positioned as a framework-agnostic pre-1.0 state library.

## 0.1.0

- Initial signals, computed values, effects, stores, history, and persistence experiment.
