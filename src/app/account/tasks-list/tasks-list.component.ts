import { Component, OnInit } from '@angular/core';
import { Task, TasksService } from '../../shared/task.service';
import { AuthService } from '../../auth/auth.service';
import firebase from 'firebase';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {

  user: firebase.User;
  tasksList: Task[] = [];

  constructor(private auth: AuthService, private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasks();
  }

  remove(task: Task): void {
    this.tasksService.remove(task, this.user?.uid).subscribe(() => {
      this.tasksList = this.tasksList.filter(t => t.id !== task.id);
    }, err => console.error(err));
  }

  tasks(): Task[] {
    this.auth.getUserState().subscribe( user => {
      this.user = user;
      this.tasksService.loadTasksList(this.user).subscribe(tasks => {
        this.tasksList = tasks;
      });
    });
    return this.tasksList;
  }
}
