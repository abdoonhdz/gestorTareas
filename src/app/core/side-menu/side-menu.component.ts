import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  sidenavOpened: boolean = window.innerWidth >= 1920;
  isScreenSmall: boolean = window.innerWidth < 1920;
  name: string | null = null;
  userRole: string = '';
  selectedLanguage: string = '';

  constructor(
    private translate: TranslateService,
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
    this.checkScreenSize();
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.selectedLanguage = language;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize(): void {
    this.isScreenSmall = window.innerWidth < 1920;
    this.sidenavOpened = !this.isScreenSmall;
  }

  hasAccess(roles: string[]): boolean {
    return roles.includes(this.userRole);
  }

  public sidebarItems = [
    { label: 'Lista de Tareas', icon: 'list', url: '/tasks', roles: ['Administrador', 'Jefe de Proyecto', 'Desarrollador'] },
    { label: 'Crear Nueva Tarea', icon: 'add', url: '/tasks/new', roles: ['Administrador', 'Jefe de Proyecto', 'Desarrollador'] },
    { label: 'Categorías', icon: 'category', url: '/categories', roles: ['Administrador', 'Jefe de Proyecto'] },
    { label: 'Sprints', icon: 'watch', url: '/sprints', roles: ['Administrador', 'Jefe de Proyecto'] },
    { label: 'Usuarios', icon: 'group', url: '/users', roles: ['Administrador'] },
    { label: 'Roles', icon: 'security', url: '/roles', roles: ['Administrador'] },
  ];
}
