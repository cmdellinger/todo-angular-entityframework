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

  // new item form
  showAddForm = false;
  newItemTitle = '';
  // activation status of completion status filter
  hideSingleSelectionIndicator = signal(false);
  // completion status filter
  filter = signal('active');
  // list of lists loading
  isLoading = signal(true);
  // lock buttons when submitting information
  isSubmitting = false;

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
    this.isSubmitting = true;
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
        this.isSubmitting = false;
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
    this.isSubmitting = true;
    const updatedList = {
      ...this.toDoList()!,
      name: this.editTitle
    };
    this.toDoListService.updateList(this.toDoListId, updatedList).subscribe(
      () => {
        this.toDoList.set(updatedList);
        this.isEditing = false;
        this.isSubmitting = false;
        this.toDoListService.triggerRefresh();
      }
    );
  }

  cancelEdit() {
    this.isEditing = false;
  }

  updateItem(toDoItem: ToDoItem) {
    this.isSubmitting = true;
    this.toDoItemService.updateItem(toDoItem.id, toDoItem).subscribe( () => {
      this.toDoItems.update(items => items.map(i => i.id === toDoItem.id ? toDoItem : i));
      this.isSubmitting = false;
    } );
  }

  // ============
  // Delete
  // ============
  
  onDelete() {
    if (!confirm('Are you sure you want to delete this list?')) return;

    this.isSubmitting = true;
    this.toDoListService.deleteList(this.toDoListId).subscribe( () => {
      this.router.navigate(['/lists']);
      this.isSubmitting = false;
    } );
  }

  deleteItem(id: number) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.isSubmitting = true;
    this.toDoItemService.deleteItem(id).subscribe( () => {
      this.toDoItems.update(items => items.filter(i => i.id !== id));
      this.isSubmitting = false;
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
