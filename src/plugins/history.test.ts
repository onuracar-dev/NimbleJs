import { describe, expect, it } from 'vitest';
import { createStore } from '../core/store';
import { withHistory } from './history';

describe('history plugin', () => {
  it('supports synchronous undo, redo, and new-branch invalidation', () => {
    const store = createStore('counter', { count: 0 });
    const history = withHistory(store);
    store.state.count.value = 1;
    store.state.count.value = 2;

    expect(history.undo()).toBe(true);
    expect(store.state.count.value).toBe(1);
    expect(history.canRedo).toBe(true);

    store.state.count.value = 7;
    expect(history.canRedo).toBe(false);
    expect(history.redo()).toBe(false);
    expect(history.undo()).toBe(true);
    expect(store.state.count.value).toBe(1);
  });

  it('enforces the history limit and can reset its baseline', () => {
    const store = createStore('limited', { count: 0 });
    const history = withHistory(store, { maxHistory: 2 });
    store.state.count.value = 1;
    store.state.count.value = 2;

    expect(history.length).toBe(2);
    expect(history.undo()).toBe(true);
    expect(store.state.count.value).toBe(1);
    expect(history.undo()).toBe(false);

    history.clear();
    expect(history.canUndo).toBe(false);
    history.dispose();
    store.state.count.value = 9;
    expect(history.canUndo).toBe(false);
  });

  it('rejects invalid limits', () => {
    const store = createStore('invalid', { count: 0 });
    expect(() => withHistory(store, { maxHistory: 0 })).toThrow(RangeError);
  });
});
