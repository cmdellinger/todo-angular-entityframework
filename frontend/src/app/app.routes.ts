import { Routes } from '@angular/router';
import { ToDoListPageComponent } from './features/todo/todo-list-page/todo-list-page.component';
import { ToDoListDetailComponent } from './features/todo/todo-list-detail/todo-list-detail.component';

export const routes: Routes = [
    { path: 'lists', component: ToDoListPageComponent},
    { path: 'lists/:id', component: ToDoListDetailComponent},
    { path: '', redirectTo: 'lists', pathMatch: 'full' },
    { path: '**', redirectTo: 'lists'}
];
