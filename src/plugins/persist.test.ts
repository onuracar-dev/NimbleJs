import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../core/store';
import { persist } from './persist';

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
}

describe('persist plugin', () => {
  it('hydrates and stores state through a provided storage adapter', () => {
    const storage = createMemoryStorage();
    storage.setItem('counter', JSON.stringify({ count: 3 }));

    const store = createStore('counter', { count: 0 });
    persist(store, { storage, key: 'counter' });

    expect(store.state.count.value).toBe(3);
    store.state.count.value = 4;
    expect(storage.getItem('counter')).toBe(JSON.stringify({ count: 4 }));
  });

  it('fails clearly when no browser storage or adapter exists', () => {
    const store = createStore('server', { ready: false });

    expect(() => persist(store)).toThrow('Persist plugin requires a Storage implementation');
  });

  it('reports corrupt saved data and replaces it with current state', () => {
    const storage = createMemoryStorage();
    storage.setItem('broken', '{not-json');
    const errors = vi.fn();
    const store = createStore('broken', { ready: true });

    persist(store, { storage, key: 'broken', onError: errors });

    expect(errors).toHaveBeenCalledWith(expect.any(SyntaxError), 'parse');
    expect(storage.getItem('broken')).toBe(JSON.stringify({ ready: true }));
  });

  it('contains storage write failures', () => {
    const storage = createMemoryStorage();
    storage.setItem = () => { throw new Error('quota'); };
    const errors = vi.fn();
    const store = createStore('quota', { count: 0 });

    expect(() => persist(store, { storage, onError: errors })).not.toThrow();
    store.state.count.value = 1;
    expect(errors).toHaveBeenCalledTimes(2);
    expect(errors).toHaveBeenLastCalledWith(expect.any(Error), 'write');
  });
});
