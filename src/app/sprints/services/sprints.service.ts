import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sprint } from '../models/sprint.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SprintsService {
  private apiUrl = 'http://localhost:3003/sprints';

  constructor(private http: HttpClient) {}

  getSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.apiUrl);
  }

  getSprintById(id: string): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.apiUrl}/${id}`);
  }

  createSprint(sprint: Sprint): Observable<Sprint> {
    return this.http.post<Sprint>(this.apiUrl, sprint);
  }

  updateSprint(id: number, sprint: Sprint): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.apiUrl}/${id}`, sprint);
  }

  deleteSprint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addTaskToSprint(sprintId: string, taskId: number): Observable<Sprint> {
    return this.http.patch<Sprint>(`${this.apiUrl}/${sprintId}`, {
      tasks: (tasks: number[]) => [...tasks, taskId],
    });
  }

  removeTaskFromSprint(sprintId: string, taskId: number): Observable<Sprint> {
    return this.http.patch<Sprint>(`${this.apiUrl}/${sprintId}`, {
      tasks: (tasks: number[]) => tasks.filter(id => id !== taskId),
    });
  }
}
