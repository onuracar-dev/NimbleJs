import { Signal, signal } from './signal';

export type StoreState = Record<string, any>;
export type SignalsRecord<T extends StoreState> = {
  [K in keyof T]: Signal<T[K]>;
};

export class Store<T extends StoreState> {
  public state: SignalsRecord<T>;
  public id: string;

  constructor(id: string, initialState: T) {
    this.id = id;
    this.state = {} as SignalsRecord<T>;
    
    for (const key in initialState) {
      if (Object.prototype.hasOwnProperty.call(initialState, key)) {
        this.state[key] = signal(initialState[key]);
      }
    }
  }

  // Helper to get raw state values
  getRawState(): T {
    const raw: any = {};
    for (const key in this.state) {
      raw[key] = this.state[key].value;
    }
    return raw as T;
  }

  // Helper to update state entirely
  setRawState(newState: Partial<T>) {
    for (const key in newState) {
      if (this.state[key] && Object.prototype.hasOwnProperty.call(newState, key)) {
        this.state[key].value = newState[key] as T[Extract<keyof T, string>];
      }
    }
  }
}

export function createStore<T extends StoreState>(id: string, initialState: T): Store<T> {
  return new Store(id, initialState);
}
