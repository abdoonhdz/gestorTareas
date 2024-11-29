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

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.username === username);

        if (user && bcrypt.compareSync(password, user.password)) {
          localStorage.setItem(this.storageKey, 'true');
          localStorage.setItem(this.nameKey, user.name);
          localStorage.setItem(this.roleKey, user.role.name);
          console.log('Usuario autenticado');
          return true;
        }

        console.log('Usuario o contraseña incorrectos');
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.nameKey);
    localStorage.removeItem(this.roleKey);
    console.log('El usuario no está autenticado');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  getName(): string | null {
    return localStorage.getItem(this.nameKey);
  }

  getUserRole(): string {
    return localStorage.getItem(this.roleKey) || '';
  }
}
