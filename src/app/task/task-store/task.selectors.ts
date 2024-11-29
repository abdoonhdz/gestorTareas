import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectTasks = createSelector(selectTaskState, (state) => state.tasks);
export const selectLoading = createSelector(selectTaskState, (state) => state.loading);
export const selectError = createSelector(selectTaskState, (state) => state.error);
