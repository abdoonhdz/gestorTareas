import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Task] Load Tasks Failure', props<{ error: any }>());

export const createTask = createAction('[Task] Create Task', props<{ task: Task }>());
export const updateTask = createAction('[Task] Update Task', props<{ id: number; task: Task }>());
