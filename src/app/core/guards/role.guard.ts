import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRole = this.authService.getUserRole();

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['rolesAllowed'] as string[];

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    console.log('Acceso denegado para el rol:', userRole);
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
