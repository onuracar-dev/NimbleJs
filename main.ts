import { batch, createStore, computed, effect, persist, withHistory } from './src';

// 1. Create a Store
const myStore = createStore('appStore', {
  count: 0
});

// 2. Apply Plugins
// Persist state to localStorage
persist(myStore);

// Add Undo/Redo history
const history = withHistory(myStore);

// 3. Create a derived computed value
const doubleCount = computed(() => myStore.state.count.value * 2);

// 4. DOM Elements
const elCount = document.getElementById('count')!;
const elDouble = document.getElementById('double-count')!;
const btnInc = document.getElementById('btn-inc')!;
const btnDec = document.getElementById('btn-dec')!;
const btnBatch = document.getElementById('btn-batch')!;
const btnUndo = document.getElementById('btn-undo')! as HTMLButtonElement;
const btnRedo = document.getElementById('btn-redo')! as HTMLButtonElement;

// 5. Effects (Reactivity)
effect(() => {
  elCount.textContent = String(myStore.state.count.value);
});

effect(() => {
  elDouble.textContent = String(doubleCount.value);
});

// History effect to update buttons
effect(() => {
  // Read state to trigger effect on changes
  myStore.state.count.value;
  btnUndo.disabled = !history.canUndo;
  btnRedo.disabled = !history.canRedo;
});

// 6. Events
btnInc.addEventListener('click', () => {
  myStore.state.count.value++;
});

btnDec.addEventListener('click', () => {
  myStore.state.count.value--;
});

btnBatch.addEventListener('click', () => {
  batch(() => {
    myStore.state.count.value++;
    myStore.state.count.value++;
    myStore.state.count.value++;
  });
});

btnUndo.addEventListener('click', () => {
  history.undo();
});

btnRedo.addEventListener('click', () => {
  history.redo();
});
