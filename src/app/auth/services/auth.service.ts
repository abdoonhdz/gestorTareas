import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../users/models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3003/users';
  private storageKey = 'isAuthenticated';
  private nameKey = 'name';
  private roleKey = 'role';
  private timestampKey = 'loginTimestamp';
  private sessionDuration = 30 * 60 * 1000;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.username === username);

        if (user && bcrypt.compareSync(password, user.password)) {
          const currentTime = Date.now();
          sessionStorage.setItem(this.storageKey, 'true');
          sessionStorage.setItem(this.nameKey, user.name);
          sessionStorage.setItem(this.roleKey, user.role.name);
          sessionStorage.setItem(this.timestampKey, currentTime.toString());
          console.log('Usuario autenticado');
          return true;
        }

        console.log('Usuario o contraseña incorrectos');
        return false;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.nameKey);
    sessionStorage.removeItem(this.roleKey);
    sessionStorage.removeItem(this.timestampKey);
    console.log('El usuario no está autenticado');
  }

  isLoggedIn(): boolean {
    const isAuthenticated = sessionStorage.getItem(this.storageKey) === 'true';
    const loginTimestamp = sessionStorage.getItem(this.timestampKey);

    if (isAuthenticated && loginTimestamp) {
      const elapsedTime = Date.now() - parseInt(loginTimestamp, 10);
      if (elapsedTime > this.sessionDuration) {
        this.logout();
        return false;
      }
      return true;
    }

    return false;
  }

  getName(): string | null {
    return sessionStorage.getItem(this.nameKey);
  }

  getUserRole(): string {
    return sessionStorage.getItem(this.roleKey) || '';
  }
}
