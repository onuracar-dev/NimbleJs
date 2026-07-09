# NimbleJS

Small signals-based state management for framework-agnostic TypeScript apps.

NimbleJS is a lightweight reactivity toolkit with signals, computed values, effects, stores, and optional plugins for persistence and history. It is designed for vanilla JavaScript, Web Components, small widgets, and projects that need reactive state without adopting a full UI framework.

## Why It Exists

Not every interactive app needs a large framework-level state layer. NimbleJS focuses on a smaller set of primitives:

- `signal` for reactive values
- `computed` for derived values
- `effect` for subscriptions
- `createStore` for grouped state
- `persist` and `withHistory` for optional behavior

## Highlights

- Framework agnostic
- Fine-grained dependency tracking
- Automatic effect cleanup when dependencies change
- Store API built on top of signals
- Persistence plugin with explicit storage support for non-browser runtimes
- Vitest coverage for core reactivity and persistence behavior

## Install

```bash
npm install @onuracar-dev/nimblejs
```

## Example

```ts
import { computed, effect, signal } from "@onuracar-dev/nimblejs";

const count = signal(0);
const doubled = computed(() => count.value * 2);

const stop = effect(() => {
  console.log(`count=${count.value}, doubled=${doubled.value}`);
});

count.value = 2;
stop();
```

## Store And Persistence

```ts
import { createStore, persist } from "@onuracar-dev/nimblejs";

const store = createStore("settings", {
  theme: "dark",
  sidebarOpen: true,
});

persist(store, {
  storage: globalThis.localStorage,
});

store.state.theme.value = "light";
```

## Project Status

This is an early library project with a compact API and working build pipeline. The next useful improvements are documentation examples, framework adapters, and a small demo page.

## Development

```bash
npm install
npm test
npm run build
```

## Recent Hardening

Vitest coverage was added for reactivity and persistence, and the persist plugin now fails clearly outside the browser unless a storage adapter is provided.

## License

MIT
