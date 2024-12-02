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
  sidenavOpened: boolean = window.innerWidth >= 1920; // Se abre solo si el ancho inicial es mayor o igual a 1920px
  isScreenSmall: boolean = window.innerWidth < 1920; // Detecta si la pantalla es pequeña
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

  // Cambia el idioma seleccionado
  changeLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.selectedLanguage = language;
  }

  // Cierra sesión
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Alterna la visibilidad del sidenav
  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  // Detecta cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  checkScreenSize(): void {
    this.isScreenSmall = window.innerWidth < 1920;
    this.sidenavOpened = !this.isScreenSmall;
  }

  // Verifica el acceso a elementos según roles
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
