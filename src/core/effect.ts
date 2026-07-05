export type EffectFn = () => void;

export interface ReactiveEffect {
  (): void;
  deps: Set<Set<ReactiveEffect>>;
}

// Stack to support nested effects
const effectStack: ReactiveEffect[] = [];

export let activeEffect: ReactiveEffect | null = null;

function cleanup(effect: ReactiveEffect) {
  // Remove this effect from all the subscriber sets it is part of
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  // Clear its dependencies so it can start fresh
  effect.deps.clear();
}

export function effect(fn: EffectFn) {
  const effectRunner: ReactiveEffect = () => {
    // Prevent infinite loops if effect mutates the state it reads
    if (!effectStack.includes(effectRunner)) {
      cleanup(effectRunner);
      try {
        effectStack.push(effectRunner);
        activeEffect = effectRunner;
        fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1] || null;
      }
    }
  };

  effectRunner.deps = new Set();
  
  // Run immediately to track dependencies
  effectRunner();
  
  // Return an unsubscribe function
  return () => {
    cleanup(effectRunner);
  };
}
