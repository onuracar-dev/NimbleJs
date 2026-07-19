import { Store, StoreState } from '../core/store';
import { effect } from '../core/effect';

export interface PersistOptions {
  storage?: Storage;
  key?: string;
  onError?: (error: unknown, operation: 'read' | 'parse' | 'write') => void;
}

export function persist<T extends StoreState>(store: Store<T>, options: PersistOptions = {}) {
  const storage = options.storage ?? getBrowserStorage();
  if (!storage) {
    throw new Error('[NimbleJS] Persist plugin requires a Storage implementation outside the browser.');
  }
  const storageKey = options.key || `nimblejs_persist_${store.id}`;

  // 1. Hydrate from storage
  let savedState: string | null = null;
  try {
    savedState = storage.getItem(storageKey);
  } catch (error) {
    reportError(error, 'read', store.id, options.onError);
  }
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState) as Partial<T>;
      store.setRawState(parsed);
    } catch (error) {
      reportError(error, 'parse', store.id, options.onError);
    }
  }

  // 2. Setup effect to automatically save changes
  // We need to read all signals to track them
  effect(() => {
    const rawState = store.getRawState();
    try {
      storage.setItem(storageKey, JSON.stringify(rawState));
    } catch (error) {
      reportError(error, 'write', store.id, options.onError);
    }
  });

  return store;
}

function getBrowserStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function reportError(
  error: unknown,
  operation: 'read' | 'parse' | 'write',
  storeId: string,
  onError?: PersistOptions['onError'],
): void {
  if (onError) onError(error, operation);
  else console.warn(`[NimbleJS] Persist ${operation} failed for store "${storeId}".`, error);
}
