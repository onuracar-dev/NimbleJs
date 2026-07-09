import { describe, expect, it, vi } from 'vitest';
import { computed, createStore, effect, signal } from '../index';

describe('NimbleJS reactivity', () => {
  it('notifies effects when a signal changes', () => {
    const count = signal(0);
    const spy = vi.fn(() => count.value);

    effect(spy);
    count.value = 1;

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('updates computed values from signal dependencies', () => {
    const count = signal(2);
    const doubled = computed(() => count.value * 2);

    expect(doubled.value).toBe(4);
    count.value = 4;
    expect(doubled.value).toBe(8);
  });

  it('creates a signal-backed store and updates raw state', () => {
    const store = createStore('user', { name: 'Onur', online: false });

    store.setRawState({ online: true });

    expect(store.state.name.value).toBe('Onur');
    expect(store.getRawState()).toEqual({ name: 'Onur', online: true });
  });
});
