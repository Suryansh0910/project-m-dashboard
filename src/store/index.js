import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('projectMState');
    if (serializedState === null) return undefined;
    const state = JSON.parse(serializedState);
    if (!state.tasks || !state.tasks.projects) {
      return undefined; // Older state shape detected, return undefined to use initialState
    }
    // Only load tasks state from localStorage
    return { tasks: state.tasks };
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({ tasks: state.tasks });
    localStorage.setItem('projectMState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
