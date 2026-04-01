import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ToDoListPageComponent } from '../todo-list-page/todo-list-page.component';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbar,
    RouterOutlet,
    ToDoListPageComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router)

  username = this.authService.currentUser()?.username;

  logout() {
    this.authService.logout().subscribe(
      () => this.router.navigate(['/login'])
    );
  }
}
