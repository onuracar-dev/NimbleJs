import { batch, computed, createStore, effect, persist, withHistory } from '@onuracar-dev/nimblejs';

// Everything on this page that counts or reacts is the real library from ../src.
// React only renders a snapshot of it.

export type NodeId = 'first' | 'last' | 'count' | 'fullName' | 'effect';

export interface LogEntry {
  run: number;
  output: string;
  reads: NodeId[];
}

export interface Snapshot {
  first: string;
  last: string;
  count: number;
  showCount: boolean;
  runs: number;
  reads: NodeId[];
  log: LogEntry[];
  lastAction: { label: string; runs: number } | null;
  canUndo: boolean;
  canRedo: boolean;
  persisted: boolean;
  pulse: Record<NodeId, number>;
}

const initial = { first: 'Ada', last: 'Lovelace', count: 0, showCount: true };
const STORAGE_KEY = 'nimblejs-site-playground';

const store = createStore('playground', initial);
const { first, last, count, showCount } = store.state;

let persisted = false;
try {
  persist(store, { key: STORAGE_KEY, onError: () => {} });
  persisted = true;
} catch {
  // No usable Storage (private mode, blocked site data). The demo still works.
}

const history = withHistory(store, { maxHistory: 25 });
const fullName = computed(() => `${first.value} ${last.value}`);

let runs = 0;
let reads: NodeId[] = [];
let log: LogEntry[] = [];
let lastAction: Snapshot['lastAction'] = null;
const pulse: Record<NodeId, number> = { first: 0, last: 0, count: 0, fullName: 0, effect: 0 };
const listeners = new Set<() => void>();
let snapshot: Snapshot | null = null;

// The effect under observation. It records what it actually read on this run,
// which is exactly what NimbleJS subscribes it to.
effect(() => {
  const seen: NodeId[] = ['fullName'];
  let output = fullName.value;
  if (showCount.value) {
    seen.push('count');
    output += ` · ${count.value}`;
  }
  runs += 1;
  reads = seen;
  pulse.effect += 1;
  log = [{ run: runs, output, reads: seen }, ...log].slice(0, 6);
  // No emit() here: building the snapshot reads every signal and would
  // subscribe this effect to all of them. track() emits after each write.
});

// Separate observers so the graph can flash the node that changed.
for (const id of ['first', 'last', 'count'] as const) {
  let primed = false;
  effect(() => {
    void store.state[id].value;
    if (primed) pulse[id] += 1;
    primed = true;
  });
}
let fullPrimed = false;
effect(() => {
  void fullName.value;
  if (fullPrimed) pulse.fullName += 1;
  fullPrimed = true;
});

function build(): Snapshot {
  return {
    first: first.value,
    last: last.value,
    count: count.value,
    showCount: showCount.value,
    runs,
    reads,
    log,
    lastAction,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    persisted,
    pulse: { ...pulse },
  };
}

function emit() {
  snapshot = build();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Snapshot {
  if (!snapshot) snapshot = build();
  return snapshot;
}

function track(label: string, write: () => void) {
  const before = runs;
  write();
  lastAction = { label, runs: runs - before };
  emit();
}

const pairs = [
  ['Grace', 'Hopper'],
  ['Katherine', 'Johnson'],
  ['Margaret', 'Hamilton'],
  ['Ada', 'Lovelace'],
];

function nextPair() {
  const index = pairs.findIndex(([f, l]) => f === first.value && l === last.value);
  return pairs[(index + 1) % pairs.length];
}

export const actions = {
  setFirst: (value: string) => track('first.value = …', () => (first.value = value)),
  setLast: (value: string) => track('last.value = …', () => (last.value = value)),
  increment: () => track('count.value++', () => (count.value += 1)),
  toggleCount: () => track('showCount toggled', () => (showCount.value = !showCount.value)),
  threeWrites: () => {
    const [f, l] = nextPair();
    track('3 writes, no batch', () => {
      first.value = f;
      last.value = l;
      count.value += 1;
    });
  },
  threeWritesBatched: () => {
    const [f, l] = nextPair();
    track('3 writes in batch()', () =>
      batch(() => {
        first.value = f;
        last.value = l;
        count.value += 1;
      }),
    );
  },
  undo: () => track('history.undo()', () => history.undo()),
  redo: () => track('history.redo()', () => history.redo()),
  reset: () => track('reset', () => store.setRawState(initial)),
};
