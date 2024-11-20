import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {

  public sidebarItems = [
    { label: 'Lista de Tareas', icon: 'list', url: '/tasks' },
    { label: 'Crear Nueva Tarea', icon: 'add', url: '/tasks/new' },
    { label: 'Categorías', icon: 'category', url: '/categories' },
    { label: 'Sprints', icon: 'watch', url: '/sprints' },
  ];

}
