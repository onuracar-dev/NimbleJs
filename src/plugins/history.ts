import { batch, effect } from '../core/effect';
import type { Store, StoreState } from '../core/store';

export interface HistoryOptions {
  maxHistory?: number;
}

export interface HistoryController {
  undo(): boolean;
  redo(): boolean;
  clear(): void;
  dispose(): void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly length: number;
}

export function withHistory<T extends StoreState>(store: Store<T>, options: HistoryOptions = {}): HistoryController {
  const maxHistory = options.maxHistory ?? 50;
  if (!Number.isInteger(maxHistory) || maxHistory < 1) {
    throw new RangeError('maxHistory must be a positive integer');
  }

  const past: T[] = [];
  const future: T[] = [];
  let isTracking = true;

  const stop = effect(() => {
    const current = cloneState(store.getRawState(), store.id);
    if (!isTracking || current === null) return;
    const previous = past[past.length - 1];
    if (previous && statesEqual(previous, current)) return;
    past.push(current);
    if (past.length > maxHistory) past.shift();
    future.length = 0;
  });

  const apply = (state: T) => {
    isTracking = false;
    try {
      batch(() => store.setRawState(state));
    } finally {
      isTracking = true;
    }
  };

  return {
    undo() {
      if (past.length <= 1) return false;
      const current = past.pop();
      if (!current) return false;
      future.push(current);
      apply(past[past.length - 1]);
      return true;
    },
    redo() {
      const next = future.pop();
      if (!next) return false;
      past.push(next);
      apply(next);
      return true;
    },
    clear() {
      const current = cloneState(store.getRawState(), store.id);
      past.length = 0;
      future.length = 0;
      if (current) past.push(current);
    },
    dispose: stop,
    get canUndo() {
      return past.length > 1;
    },
    get canRedo() {
      return future.length > 0;
    },
    get length() {
      return past.length;
    },
  };
}

function cloneState<T>(state: T, storeId: string): T | null {
  try {
    return JSON.parse(JSON.stringify(state)) as T;
  } catch (error) {
    console.warn(`[NimbleJS] History cannot serialize store "${storeId}".`, error);
    return null;
  }
}

function statesEqual(left: StoreState, right: StoreState): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
