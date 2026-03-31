import { Routes } from '@angular/router';
import { ToDoListPageComponent } from './features/todo/todo-list-page/todo-list-page.component';
import { ToDoListDetailComponent } from './features/todo/todo-list-detail/todo-list-detail.component';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    { path: 'lists', component: ToDoListPageComponent, canActivate: [authGuard]},
    { path: 'lists/:id', component: ToDoListDetailComponent, canActivate: [authGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'lists', pathMatch: 'full' },
    { path: '**', redirectTo: 'lists'}
];
