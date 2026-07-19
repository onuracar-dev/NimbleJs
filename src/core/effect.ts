export type EffectCleanup = () => void;
/** Any returned function is treated as cleanup; other return values are ignored. */
export type EffectFn = () => unknown;
export type EffectScheduler = (run: () => void) => void;

export interface EffectOptions {
  scheduler?: EffectScheduler;
}

export interface ReactiveEffect {
  (): void;
  deps: Set<Set<ReactiveEffect>>;
  active: boolean;
  running: boolean;
  scheduler?: EffectScheduler;
}

const effectStack: ReactiveEffect[] = [];
const pendingEffects = new Set<ReactiveEffect>();
let batchDepth = 0;

export let activeEffect: ReactiveEffect | null = null;

export function effect(fn: EffectFn, options: EffectOptions = {}): EffectCleanup {
  let userCleanup: EffectCleanup | undefined;

  const runner: ReactiveEffect = () => {
    if (!runner.active || runner.running) return;
    runner.running = true;
    try {
      const previousCleanup = userCleanup;
      userCleanup = undefined;
      runCleanup(previousCleanup);
      removeDependencies(runner);
      effectStack.push(runner);
      activeEffect = runner;
      try {
        const result = fn();
        if (typeof result === 'function') userCleanup = result as EffectCleanup;
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1] ?? null;
      }
    } finally {
      runner.running = false;
    }
  };

  runner.deps = new Set();
  runner.active = true;
  runner.running = false;
  runner.scheduler = options.scheduler;
  runner();

  return () => {
    if (!runner.active) return;
    runner.active = false;
    pendingEffects.delete(runner);
    removeDependencies(runner);
    const finalCleanup = userCleanup;
    userCleanup = undefined;
    runCleanup(finalCleanup);
  };
}

export function batch<T>(fn: () => T): T {
  batchDepth += 1;
  try {
    return fn();
  } finally {
    batchDepth -= 1;
    if (batchDepth === 0) flushEffects();
  }
}

export function notifyEffect(reactiveEffect: ReactiveEffect): void {
  if (!reactiveEffect.active || reactiveEffect.running) return;
  if (batchDepth > 0) pendingEffects.add(reactiveEffect);
  else schedule(reactiveEffect);
}

function flushEffects(): void {
  while (pendingEffects.size > 0) {
    const effects = Array.from(pendingEffects);
    pendingEffects.clear();
    for (const reactiveEffect of effects) schedule(reactiveEffect);
  }
}

function schedule(reactiveEffect: ReactiveEffect): void {
  if (reactiveEffect.scheduler) reactiveEffect.scheduler(reactiveEffect);
  else reactiveEffect();
}

function removeDependencies(reactiveEffect: ReactiveEffect): void {
  for (const dependency of reactiveEffect.deps) dependency.delete(reactiveEffect);
  reactiveEffect.deps.clear();
}

function runCleanup(cleanup: EffectCleanup | undefined): void {
  if (cleanup) cleanup();
}
