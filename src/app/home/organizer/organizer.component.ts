import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {switchMap} from 'rxjs/operators';
import {DateService} from '../../shared/data.service';
import {Task, TasksService} from '../../shared/task.service';
import firebase from 'firebase';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  form!: FormGroup;
  tasks: Task[] = [];
  user: firebase.User;

  constructor(private auth: AuthService, public dateService: DateService, private tasksService: TasksService) {
  }

  ngOnInit(): void {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      });
    this.dateService.date.pipe(
      switchMap(value => this.tasksService.load(value, this.user))
    ).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit(): void {
    const {title} = this.form.value;

    const user = this.user?.uid;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    // tslint:disable-next-line:no-shadowed-variable
    this.tasksService.create(task, user).subscribe(task => {
      this.tasks.push(task);
      this.form.reset();
    }, err => console.error(err));
  }

  remove(task: Task): void {
    this.tasksService.remove(task, this.user?.uid).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }, err => console.error(err));
  }
}
