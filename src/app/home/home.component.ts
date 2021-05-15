import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: firebase.User;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      });
  }

  displayName(): string {
    return this.user?.displayName;
  }
}
