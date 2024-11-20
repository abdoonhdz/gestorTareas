import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SprintsService } from '../../services/sprints.service';
import { TaskService } from '../../../task/services/task.service';
import { Sprint } from '../../models/sprint.model';
import { Task } from '../../../task/models/task.model';

@Component({
  selector: 'app-sprint-detail',
  templateUrl: './sprint-detail.component.html',
  styleUrls: ['./sprint-detail.component.css']
})
export class SprintDetailComponent implements OnInit {
  sprint!: Sprint;
  tasks: Task[] = [];

  constructor(
    private route: ActivatedRoute,
    private sprintsService: SprintsService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sprintId = this.route.snapshot.paramMap.get('id')!;
    this.sprintsService.getSprintById(sprintId).subscribe(sprint => {
      this.sprint = sprint;

      if (sprint.tasks && sprint.tasks.length) {
        this.taskService.getTasks().subscribe(allTasks => {
          this.tasks = allTasks.filter(task => sprint.tasks.includes(task.id));
        });
      }
    });
  }

  goBackButton(): void {
    this.router.navigate(['/sprints']);
  }
}
