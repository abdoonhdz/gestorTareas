import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = 'http://localhost:3003/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.getUserById(id).pipe(
      switchMap((existingUser) => {
        const updatedUser = {
          ...existingUser,
          ...user,
          password: user.password?.trim()
            ? bcrypt.hashSync(user.password, 10)
            : existingUser.password,
        };
        return this.http.put<User>(`${this.apiUrl}/${id}`, updatedUser);
      })
    );
  }


  createUser(user: User): Observable<User> {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const userWithHashedPassword = { ...user, password: hashedPassword };

    return this.http.post<User>(this.apiUrl, userWithHashedPassword);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
