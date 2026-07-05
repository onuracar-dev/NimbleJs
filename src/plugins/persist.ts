import { Store, StoreState } from '../core/store';
import { effect } from '../core/effect';

export interface PersistOptions {
  storage?: Storage;
  key?: string;
}

export function persist<T extends StoreState>(store: Store<T>, options: PersistOptions = {}) {
  const storage = options.storage || window.localStorage;
  const storageKey = options.key || `nimblejs_persist_${store.id}`;

  // 1. Hydrate from storage
  const savedState = storage.getItem(storageKey);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState) as Partial<T>;
      store.setRawState(parsed);
    } catch (e) {
      console.warn(`[NimbleJS] Failed to parse persisted state for store: ${store.id}`, e);
    }
  }

  // 2. Setup effect to automatically save changes
  // We need to read all signals to track them
  effect(() => {
    const rawState = store.getRawState();
    storage.setItem(storageKey, JSON.stringify(rawState));
  });

  return store;
}
