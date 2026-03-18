import { Component, inject } from '@angular/core';
import { ToDoListService } from '../../../core/services/todo-list';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToDoListComponent } from "../todo-list/todo-list.component";

@Component({
  selector: 'app-todo-list-page',
  imports: [ToDoListComponent],
  templateUrl: './todo-list-page.component.html',
  styleUrl: './todo-list-page.component.scss',
})
export class ToDoListPageComponent {
  private toDoListService = inject(ToDoListService);

  userId: string = '1'; // TODO: replace with auth user id in Phase 3
  toDoLists = toSignal(this.toDoListService.getLists(this.userId));
  
}
