import { effect } from './effect';
import { Signal } from './signal';

export class Computed<T> extends Signal<T> {
  constructor(computeFn: () => T) {
    // Initialize with undefined, we will set it immediately in the effect
    super(undefined as unknown as T);
    
    // We run the computeFn inside an effect so that this computed
    // automatically tracks dependencies and updates its own value
    effect(() => {
      this.value = computeFn();
    });
  }
}

export function computed<T>(computeFn: () => T): Computed<T> {
  return new Computed(computeFn);
}
