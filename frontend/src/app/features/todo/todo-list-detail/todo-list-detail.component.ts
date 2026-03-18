import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { ToDoItemService } from '../../../core/services/todo-item';
import { ToDoListService } from '../../../core/services/todo-list';

import { ToDoItem } from '../../../core/models/todo-item.model';
import { ToDoList } from '../../../core/models/todo-list.model';
import { ToDoItemComponent } from "../todo-item/todo-item.component";

@Component({
  selector: 'app-todo-list-detail',
  imports: [
    ToDoItemComponent,
    FormsModule
  ],
  templateUrl: './todo-list-detail.component.html',
  styleUrl: './todo-list-detail.component.scss',
})
export class ToDoListDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toDoItemService = inject(ToDoItemService);
  private toDoListService = inject(ToDoListService);

  toDoListId = Number(this.route.snapshot.paramMap.get('id'));
  toDoList = signal<ToDoList | undefined>(undefined);
  toDoItems = signal<ToDoItem[]>([]);

  constructor() {
    this.toDoListService.getList(this.toDoListId).subscribe(
      list => { 
        this.toDoList.set(list);
      }
    )
    this.toDoItemService.getItems(this.toDoListId).subscribe(
      items => {
        this.toDoItems.set(items);
      }
    )
  }

  // ============
  // Add
  // ============

  addItem() {
    const newItem: ToDoItem = {
      id: 0,
      title: 'new to-do item',
      isCompleted: false,
      sortOrder: 0,
      toDoListId: this.toDoListId,
      createdAt: new Date().toISOString(),
      updatedAt: undefined
    };
    this.toDoItemService.addItem(this.toDoListId, newItem).subscribe(
      created => {
        this.toDoItems.update( items => [...items, created])
      }
    );
  }

  // ============
  // Edit
  // ============
  isEditing = false;
  editTitle = '';

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.toDoList()?.name ?? '';
  }

  saveEdit() {
    const updatedList = {
      ...this.toDoList()!,
      name: this.editTitle
    };
    this.toDoListService.updateList(this.toDoListId, updatedList).subscribe(
      () => {
        this.toDoList.set(updatedList);
        this.isEditing = false;
      }
    );
  }

  cancelEdit() {
    this.isEditing = false;
  }

  updateItem(toDoItem: ToDoItem) {
    this.toDoItemService.updateItem(toDoItem.id, toDoItem).subscribe(() => {
      this.toDoItems.update(items => items.map(i => i.id === toDoItem.id ? toDoItem : i));
    });
  }

  // ============
  // Delete
  // ============
  
  onDelete() {
    this.toDoListService.deleteList(this.toDoListId).subscribe(() => {
      this.router.navigate(['/lists']);
    });
  }

  deleteItem(id: number) {
    this.toDoItemService.deleteItem(id).subscribe(() => {
      this.toDoItems.update(items => items.filter(i => i.id !== id));
    });
  }
}
