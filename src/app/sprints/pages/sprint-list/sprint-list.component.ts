import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sprint } from '../../models/sprint.model';
import { SprintsService } from '../../services/sprints.service';

@Component({
  selector: 'app-sprint-list',
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.css']
})
export class SprintListComponent implements OnInit {
  sprints: Sprint[] = [];

  constructor(private sprintService: SprintsService, private router: Router) {}

  ngOnInit(): void {
    this.loadSprints();
  }

  loadSprints(): void {
    this.sprintService.getSprints().subscribe(sprints => {
      this.sprints = sprints;
    });
  }

  createSprint(): void {
    this.router.navigate(['/sprints/new']);
  }

  viewSprintDetail(sprintId: string): void {
    this.router.navigate([`/sprints/${sprintId}`]);
  }


}
