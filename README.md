# NimbleJS

Small, framework-agnostic signals and state management for TypeScript apps.

<img src="./docs/assets/preview.svg" alt="NimbleJS reactivity preview">

[Live website](https://nimblejs.onuracar-work.workers.dev/) · [GitHub repository](https://github.com/onuracar-dev/NimbleJs)

NimbleJS provides signals, computed values, effects, batched updates, stores,
and optional history/persistence plugins. It has no renderer and no DOM
dependency in its core, so it can support vanilla JavaScript, Web Components,
workers, and framework adapters.

> **Status:** pre-1.0 and suitable for experiments. API compatibility and
> performance guarantees are not yet stable.

## Install

```bash
npm install @onuracar-dev/nimblejs
```

## Signals, computed values, and cleanup

```ts
import { computed, effect, signal } from '@onuracar-dev/nimblejs';

const count = signal(0);
const doubled = computed(() => count.value * 2);

const stop = effect(() => {
  console.log(`count=${count.value}, doubled=${doubled.value}`);
  return () => console.log('cleanup before the next run');
});

count.value = 2;
stop();
doubled.dispose();
```

Effects subscribe only to values read in their latest run. Stopping an effect
removes its dependencies and executes its final cleanup once.

## Batching and scheduling

`batch` delays notifications until its outermost callback completes and runs
each affected effect once.

```ts
import { batch, effect, signal } from '@onuracar-dev/nimblejs';

const first = signal('Ada');
const last = signal('Lovelace');
effect(() => console.log(`${first.value} ${last.value}`));

batch(() => {
  first.value = 'Grace';
  last.value = 'Hopper';
});
```

Effects also accept a scheduler for integration with microtask, animation-frame,
or host-framework queues:

```ts
effect(render, { scheduler: (run) => queueMicrotask(run) });
```

The scheduler owns de-duplication outside a NimbleJS `batch`.

## Stores, persistence, and history

```ts
import { createStore, persist, withHistory } from '@onuracar-dev/nimblejs';

const settings = createStore('settings', { theme: 'dark', sidebarOpen: true });
persist(settings, { storage: globalThis.localStorage });
const history = withHistory(settings, { maxHistory: 25 });

settings.setRawState({ theme: 'light', sidebarOpen: false });
history.undo();
history.dispose();
```

Persistence uses JSON and application-provided `Storage`. It does not encrypt,
validate, migrate, or synchronize state. History also uses JSON snapshots, so
circular and non-serializable values are outside its supported scope.

## API

| Export | Purpose |
| --- | --- |
| `signal` | Mutable reactive value with `Object.is` equality |
| `computed` | Derived value with explicit `dispose()` |
| `effect` | Dependency-tracked side effect with cleanup and optional scheduler |
| `batch` | Coalesce notifications across nested synchronous writes |
| `createStore` | Named collection of signals and batched raw-state updates |
| `persist` | Hydrate/save a store through a `Storage` adapter |
| `withHistory` | Bounded JSON-snapshot undo/redo controller |

## Development

```bash
npm ci
npm test
npm run build
npm run pack:check
```

The architectural boundary with FluxDOM is recorded in
[`docs/adr/0001-fluxdom-and-nimblejs-boundary.md`](./docs/adr/0001-fluxdom-and-nimblejs-boundary.md):
the projects share tested semantics but do not depend on one another.

## License

MIT. Copyright 2026 Onur Acar.
