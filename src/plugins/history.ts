import { Store, StoreState } from '../core/store';
import { effect } from '../core/effect';

export interface HistoryOptions {
  maxHistory?: number;
}

export function withHistory<T extends StoreState>(store: Store<T>, options: HistoryOptions = {}) {
  const maxHistory = options.maxHistory || 50;
  
  const past: T[] = [];
  const future: T[] = [];
  
  let isTracking = true;

  // Track changes automatically
  effect(() => {
    const currentState = store.getRawState();
    
    if (isTracking) {
      try {
        const serialized = JSON.stringify(currentState);
        const lastPast = past[past.length - 1];
        
        if (!lastPast || JSON.stringify(lastPast) !== serialized) {
          past.push(JSON.parse(serialized) as T);
          
          if (past.length > maxHistory) {
            past.shift();
          }
          
          // Clear future on new action
          future.length = 0;
        }
      } catch (err) {
        console.warn(`[NimbleJS] History plugin failed to serialize state for store: ${store.id}. Check for circular references.`, err);
      }
    }
  });

  return {
    undo: () => {
      if (past.length > 1) {
        isTracking = false;
        
        // Pop current state and push to future
        const current = past.pop()!;
        future.push(current);
        
        // Apply previous state
        const previous = past[past.length - 1];
        store.setRawState(previous);
        
        // Re-enable tracking
        Promise.resolve().then(() => { isTracking = true; });
      }
    },
    redo: () => {
      if (future.length > 0) {
        isTracking = false;
        
        const next = future.pop()!;
        past.push(next);
        
        store.setRawState(next);
        
        Promise.resolve().then(() => { isTracking = true; });
      }
    },
    get canUndo() {
      return past.length > 1;
    },
    get canRedo() {
      return future.length > 0;
    }
  };
}
