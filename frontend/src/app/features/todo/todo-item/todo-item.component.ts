import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInput } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';

import { ToDoItem } from '../../../core/models/todo-item.model';
import { CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-item',
  imports: [
    CdkDragHandle,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatInput
],
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