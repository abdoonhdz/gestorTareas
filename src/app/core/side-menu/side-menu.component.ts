import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent{

  selectedLanguage: string = '';

  constructor(private translate: TranslateService, private cdr: ChangeDetectorRef) {
    const browserLang = this.translate.getBrowserLang();
    this.selectedLanguage = browserLang || 'es';
    this.translate.use(this.selectedLanguage);
  }

  changeLanguage(language: string): void {
    console.log('Cambiando idioma a:', language);
    this.translate.use(language).subscribe(() => {
      this.cdr.detectChanges();
    });
    localStorage.setItem('language', language);
    this.selectedLanguage = language;
  }



  public sidebarItems = [
    { label: 'Lista de Tareas', icon: 'list', url: '/tasks' },
    { label: 'Crear Nueva Tarea', icon: 'add', url: '/tasks/new' },
    { label: 'Categorías', icon: 'category', url: '/categories' },
    { label: 'Sprints', icon: 'watch', url: '/sprints' },
    { label: 'Usuarios', icon: 'group', url: '/users' },
  ];

}
