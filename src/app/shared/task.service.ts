import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import firebase from 'firebase';
import {HomeComponent} from '../home/home.component';

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

interface CreateResponse {
  name: string; 
}

@Injectable({providedIn: 'root'})
export class TasksService {
  static url = `https://organizer-53db8-default-rtdb.firebaseio.com/tasks/`;
  home: HomeComponent;
  user: firebase.User;
  tasks: Task[] = [];
  unsortedTasks: Task[] = [];
  sortedTasks: Task[] = [];
  tasksList: Task[] = [];

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment, user): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${user?.uid}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return [];
        }
        return Object.keys(tasks).map(key => ({...tasks[key], id: key}));
      }));
  }

  loadTasksList(user): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${user?.uid}.json`)
      .pipe(map(receivedTasks => {
        if (!receivedTasks) {
          return [];
        }
        this.unsortedTasks = Object.keys(receivedTasks).map(key => ({...receivedTasks[key]}));
        this.unsortedTasks.forEach(unsortedTasks => {
          this.sortedTasks = Object.keys(unsortedTasks).map(key => ({...unsortedTasks[key], id: key}));
          this.sortedTasks.forEach(preparedTasks => {
            this.tasksList.push(preparedTasks);
          });
        });
        return this.tasksList;
      }));
  }

  create(task: Task, user): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${user}/${task.date}.json`, task)
      .pipe(map(res => {
        return {...task, id: res.name};
      }));
  }

  remove(task: Task, user): Observable<void> {
    return this.http
      .delete<void>(`${TasksService.url}/${user}/${task.date}/${task.id}.json`);
  }
}
