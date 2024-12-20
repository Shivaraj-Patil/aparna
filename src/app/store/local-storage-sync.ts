import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

export function localStorageSyncReducer<T>(reducer: ActionReducer<T>): ActionReducer<T> {
  return (state, action) => {
    const nextState = reducer(state, action);

    if (action.type === INIT || action.type === UPDATE) {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        return JSON.parse(savedState);
      }
    }

    localStorage.setItem('appState', JSON.stringify(nextState));
    return nextState;
  };
}