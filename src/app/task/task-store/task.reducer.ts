import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './task.actions';
import { TaskState, initialTaskState } from './task.state';

export const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.loadTasks, state => ({ ...state, loading: true, error: null })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => (t.id === task.id ? task : t)),
  }))
);
