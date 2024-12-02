// import { Injectable } from '@angular/core';
// import { Actions, ofType, createEffect } from '@ngrx/effects';
// import { of } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import * as TaskActions from './task.actions';
// import { TaskService } from '../services/task.service';

// @Injectable()
// export class TaskEffects {
//   constructor(
//     private actions$: Actions,
//     private taskService: TaskService
//   ) {
//     console.log('Actions:', this.actions$);
//     console.log('TaskService:', this.taskService);
//   }

//   loadTasks$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(TaskActions.loadTasks),
//       mergeMap(() =>
//         this.taskService.getAllTasks().pipe(
//           map(tasks => TaskActions.loadTasksSuccess({ tasks })),
//           catchError(error => of(TaskActions.loadTasksFailure({ error })))
//         )
//       )
//     )
//   );

//   updateTask$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(TaskActions.updateTask),
//       mergeMap(({ task }) =>
//         this.taskService.updateTask(task.id.toString(), task).pipe(
//           map(() => TaskActions.updateTaskSuccess({ task })),
//           catchError(error => of(TaskActions.updateTaskFailure({ error })))
//         )
//       )
//     )
//   );
// }
