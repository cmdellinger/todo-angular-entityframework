import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { ToDoItemService } from '../../../core/services/todo-item.service';
import { ToDoListService } from '../../../core/services/todo-list.service';

import { ToDoItem } from '../../../core/models/todo-item.model';
import { ToDoList } from '../../../core/models/todo-list.model';
import { ToDoItemComponent } from "../todo-item/todo-item.component";

@Component({
  selector: 'app-todo-list-detail',
  imports: [
    DragDropModule,
    FormsModule,
    MatAnchor,
    MatButton,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconButton,
    MatIconModule,
    MatListModule,
    MatProgressSpinner,
    ToDoItemComponent
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

  showAddForm = false;
  newItemTitle = '';
  hideSingleSelectionIndicator = signal(false);
  filter = signal('active');
  isLoading = signal(true);

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.isLoading.set(true);
      this.toDoListId = Number(params.get('id'));
      
      forkJoin( [
          this.toDoListService.getList(this.toDoListId),
          this.toDoItemService.getItems(this.toDoListId)
      ] ).subscribe(([list, items]) => {
          this.toDoList.set(list);
          this.toDoItems.set(items);
          this.isLoading.set(false);
      } );
    } );
  }

  // ============
  // Add
  // ============

  addItem() {
    const newItem: ToDoItem = {
      id: 0,
      title: this.newItemTitle || 'new to-do item',
      isCompleted: false,
      sortOrder: 0,
    };
    this.toDoItemService.addItem(this.toDoListId, newItem).subscribe(
      created => {
        this.toDoItems.update( items => [...items, created]);
        this.newItemTitle = '';
        this.showAddForm = false;
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
        this.toDoListService.triggerRefresh();
      }
    );
  }

  cancelEdit() {
    this.isEditing = false;
  }

  updateItem(toDoItem: ToDoItem) {
    this.toDoItemService.updateItem(toDoItem.id, toDoItem).subscribe( () => {
      this.toDoItems.update(items => items.map(i => i.id === toDoItem.id ? toDoItem : i));
    } );
  }

  // ============
  // Delete
  // ============
  
  onDelete() {
    this.toDoListService.deleteList(this.toDoListId).subscribe( () => {
      this.router.navigate(['/lists']);
    } );
  }

  deleteItem(id: number) {
    this.toDoItemService.deleteItem(id).subscribe( () => {
      this.toDoItems.update(items => items.filter(i => i.id !== id));
    } );
  }

  // ============
  // UI
  // ============
  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  filteredItems = computed( () => {
    const items = this.toDoItems();
    switch (this.filter()) {
      case 'active': return items.filter(i => !i.isCompleted);
      case 'completed': return items.filter(i => i.isCompleted);
      default: return items;
    }
  } );

  onDrop(event: CdkDragDrop<ToDoItem[]>) {
    const filtered = [...this.filteredItems()];
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);

    const filteredIds = new Set(filtered.map(item => item.id));
    const reordered = [
      ...filtered,
      ...this.toDoItems().filter(item => !filteredIds.has(item.id))
    ]

    this.toDoItems.set(reordered);
    const itemIds = reordered.map(item => item.id);
    this.toDoListService.reorderList(this.toDoListId, itemIds). subscribe();
  }
}
