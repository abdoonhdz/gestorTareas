import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 }))
      ]),
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate(200, style({ opacity: 1}))
        ], { optional: true }),
        query(':leave', [
          style({ opacity: 1 }),
          animate(200, style({ opacity: 0 }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class AppComponent {
  title = 'gestorTareas';

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData['animation'];
  }
}
