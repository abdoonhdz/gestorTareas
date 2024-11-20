import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SprintsService } from '../../services/sprints.service';
import { TaskService } from '../../../task/services/task.service';
import { Task } from '../../../task/models/task.model';

@Component({
  selector: 'app-sprint-new',
  templateUrl: './sprint-new.component.html',
  styleUrls: ['./sprint-new.component.css']
})
export class SprintNewComponent implements OnInit {
  sprintForm!: FormGroup;
  availableTasks: Task[] = [];

  constructor(
    private fb: FormBuilder,
    private sprintsService: SprintsService,
    private tasksService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sprintForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      tasks: [<number[]>[]]
    });

    this.tasksService.getTasks().subscribe(tasks => {
      const subtasksIds = tasks.reduce((acc, task) => {
        if (task.subtasks && task.subtasks.length > 0) {
          acc.push(...task.subtasks);
        }
        return acc;
      }, [] as number[]);

      this.availableTasks = tasks.filter(task => !subtasksIds.includes(task.id));
    });
  }

  onSubmit(): void {
    if (this.sprintForm.invalid) {
      return;
    }
    this.sprintsService.createSprint(this.sprintForm.value).subscribe(() => {
      this.router.navigate(['/sprints']);
    });
  }

  goBackButton(): void {
    this.router.navigate(['/sprints']);
  }
}
