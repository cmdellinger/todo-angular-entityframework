import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';

import { ToDoList } from '../../../core/models/todo-list.model';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class ToDoListComponent {
  private router = inject(Router);

  @Input() toDoList!: ToDoList;

  navigateToDetail() {
    this.router.navigate(['lists', this.toDoList.id]);
  }
}
