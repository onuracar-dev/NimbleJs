# Contributing to NimbleJS

1. Use Node.js 20.19 or newer and run `npm ci`.
2. Keep the core framework-agnostic and free of DOM assumptions.
3. Add tests for public behavior and cleanup semantics.
4. Run `npm test` and `npm run build` before opening a pull request.
5. Describe compatibility and bundle-size impact in the pull request.

Do not commit generated output, dependencies, secrets, or local npm settings.
Significant package-boundary changes require an ADR.
