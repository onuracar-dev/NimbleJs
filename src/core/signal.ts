import { activeEffect, notifyEffect, type ReactiveEffect } from './effect';

export class Signal<T> {
  private _value: T;
  private subscribers: Set<ReactiveEffect> = new Set();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    this.track();
    return this._value;
  }

  set value(newValue: T) {
    if (!Object.is(this._value, newValue)) {
      this._value = newValue;
      this.trigger();
    }
  }

  private track() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
      // Let the active effect know it is subscribed to this set
      activeEffect.deps.add(this.subscribers);
    }
  }

  private trigger() {
    const subs = new Set(this.subscribers);
    subs.forEach(notifyEffect);
  }
}

export function signal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
}
