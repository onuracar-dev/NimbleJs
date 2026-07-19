import { effect, type EffectCleanup } from './effect';
import { signal, type Signal } from './signal';

export class Computed<T> {
  private readonly state: Signal<T>;
  private readonly stopEffect: EffectCleanup;

  constructor(compute: () => T) {
    this.state = signal<T>(undefined as T);
    this.stopEffect = effect(() => {
      this.state.value = compute();
    });
  }

  get value(): T {
    return this.state.value;
  }

  /** Permanently stop this computed value from observing its dependencies. */
  dispose(): void {
    this.stopEffect();
  }
}

export function computed<T>(compute: () => T): Computed<T> {
  return new Computed(compute);
}
