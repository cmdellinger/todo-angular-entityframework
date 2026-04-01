import { Routes } from '@angular/router';
import { ToDoListPageComponent } from './features/todo/todo-list-page/todo-list-page.component';
import { ToDoListDetailComponent } from './features/todo/todo-list-detail/todo-list-detail.component';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/todo/dashboard/dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'lists', component: DashboardComponent, canActivate: [authGuard], children: [
            { path: ':id', component: ToDoListDetailComponent },
    ] },
    { path: '', redirectTo: 'lists', pathMatch: 'full' },
    { path: '**', redirectTo: 'lists'}
];
