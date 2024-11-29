import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  selectedLanguage: string = '';
  name: string | null = null;
  userRole: string = '';

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    const browserLang = this.translate.getBrowserLang();
    this.selectedLanguage = browserLang || 'es';
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit(): void {
    this.name = this.authService.getName();
    this.userRole = this.authService.getUserRole();
  }

  changeLanguage(language: string): void {
    this.translate.use(language).subscribe(() => {
      this.cdr.detectChanges();
    });
    localStorage.setItem('language', language);
    this.selectedLanguage = language;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public sidebarItems = [
    { label: 'Lista de Tareas', icon: 'list', url: '/tasks', roles: ['Administrador', 'Jefe de Proyecto', 'Desarrollador'] },
    { label: 'Crear Nueva Tarea', icon: 'add', url: '/tasks/new', roles: ['Administrador', 'Jefe de Proyecto', 'Desarrollador'] },
    { label: 'Categorías', icon: 'category', url: '/categories', roles: ['Administrador', 'Jefe de Proyecto'] },
    { label: 'Sprints', icon: 'watch', url: '/sprints', roles: ['Administrador', 'Jefe de Proyecto'] },
    { label: 'Usuarios', icon: 'group', url: '/users', roles: ['Administrador'] },
    { label: 'Roles', icon: 'security', url: '/roles', roles: ['Administrador'] },
  ];

  hasAccess(roles: string[]): boolean {
    return roles.includes(this.userRole);
  }
}
