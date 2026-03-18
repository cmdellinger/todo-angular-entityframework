import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToDoItem } from '../../../core/models/todo-item.model';

@Component({
  selector: 'app-todo-item',
  imports: [FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class ToDoItemComponent {
  @Input() toDoItem!: ToDoItem;
  @Output() toDoItemUpdated = new EventEmitter<ToDoItem>();
  @Output() toDoItemDeleted = new EventEmitter<number>();

  // ==========
  // Edit
  // ==========
  isEditing = false;
  editTitle = '';
  editDescription = '';

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.toDoItem.title;
    this.editDescription = this.toDoItem.description ?? '';
  }

  saveEdit() {
    this.toDoItemUpdated.emit({
      ...this.toDoItem,
      title: this.editTitle,
      description: this.editDescription
    });

    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onCompleted() {
    this.toDoItemUpdated.emit({
      ...this.toDoItem,
      isCompleted: !this.toDoItem.isCompleted
    });
  }

  // ==========
  // Delete
  // ==========

  onDelete() {
    this.toDoItemDeleted.emit(this.toDoItem.id);
  }

}