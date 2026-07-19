import { describe, expect, it, vi } from 'vitest';
import { batch, computed, createStore, effect, signal } from '../index';

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

  it('cleans dynamic dependencies after every run', () => {
    const usePrimary = signal(true);
    const primary = signal('a');
    const secondary = signal('b');
    const values: string[] = [];
    effect(() => values.push(usePrimary.value ? primary.value : secondary.value));

    usePrimary.value = false;
    primary.value = 'ignored';
    secondary.value = 'used';

    expect(values).toEqual(['a', 'b', 'used']);
  });

  it('runs cleanup before reruns and exactly once when stopped', () => {
    const count = signal(0);
    const events: string[] = [];
    const stop = effect(() => {
      const value = count.value;
      events.push(`run:${value}`);
      return () => events.push(`cleanup:${value}`);
    });

    count.value = 1;
    stop();
    stop();
    count.value = 2;

    expect(events).toEqual(['run:0', 'cleanup:0', 'run:1', 'cleanup:1']);
  });

  it('coalesces nested batches and batches whole-store updates', () => {
    const store = createStore('profile', { first: 'A', last: 'B' });
    const snapshots: string[] = [];
    effect(() => snapshots.push(`${store.state.first.value}${store.state.last.value}`));

    batch(() => {
      store.state.first.value = 'C';
      batch(() => {
        store.state.last.value = 'D';
        store.state.first.value = 'E';
      });
    });
    store.setRawState({ first: 'F', last: 'G' });

    expect(snapshots).toEqual(['AB', 'ED', 'FG']);
  });

  it('supports a custom scheduler after batch de-duplication', () => {
    const count = signal(0);
    const queue: Array<() => void> = [];
    const spy = vi.fn(() => count.value);
    effect(spy, { scheduler: (run) => queue.push(run) });

    batch(() => {
      count.value = 1;
      count.value = 2;
    });

    expect(queue).toHaveLength(1);
    expect(spy).toHaveBeenCalledTimes(1);
    queue.shift()?.();
    expect(spy).toHaveBeenLastCalledWith();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('uses Object.is equality and allows computed values to be disposed', () => {
    const source = signal(Number.NaN);
    const spy = vi.fn(() => source.value);
    effect(spy);
    source.value = Number.NaN;
    expect(spy).toHaveBeenCalledTimes(1);

    const count = signal(2);
    const doubled = computed(() => count.value * 2);
    const values: number[] = [];
    effect(() => values.push(doubled.value));
    count.value = 3;
    doubled.dispose();
    count.value = 4;
    expect(values).toEqual([4, 6]);
    expect(doubled.value).toBe(6);
  });
});
