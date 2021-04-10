import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: firebase.User;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  tasksList(): void {
    this.router.navigateByUrl('/account/tasks-list').then(r => r);
  }

  logout(): void {
    this.auth.logout();
  }

  userInfo(): string {
    return this.user.uid;
  }
}
