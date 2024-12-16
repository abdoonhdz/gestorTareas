import { createReducer, on } from '@ngrx/store';
import { loadTasksSuccess, createTask, updateTask } from './task.actions';
import { Task } from '../models/task.model';

export interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

export const taskReducer = createReducer(
  initialState,
  on(loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks })),
  on(createTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
  on(updateTask, (state, { id, task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? { ...task } : t)),
  }))
);
