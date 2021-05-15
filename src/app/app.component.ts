import { Component, OnInit } from '@angular/core';
import { ThemeService } from './shared/theme.service';
import firebase from 'firebase';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isDarkMode: boolean;

  user: firebase.User;

  ngOnInit(): void {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      });
  }

  constructor(private themeService: ThemeService, private auth: AuthService, private router: Router) {
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  toggleDarkMode(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.isDarkMode ? this.themeService.update('light-mode') : this.themeService.update('dark-mode');
  }

  home(): void {
    this.router.navigate(['/home']);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.auth.logout();
  }
}
