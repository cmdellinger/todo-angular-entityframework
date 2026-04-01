import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from "@angular/material/input";
import { MatAnchor } from "@angular/material/button";
import { MatListModule, MatNavList } from '@angular/material/list';

import { AuthService } from '../../../core/services/auth.service';

import { ToDoListService } from '../../../core/services/todo-list.service';
import { ToDoList } from '../../../core/models/todo-list.model';
import { CreateListDto } from '../../../core/dtos/list/create-list.dto';

@Component({
  selector: 'app-todo-list-page',
  imports: [
    MatAnchor,
    MatFormFieldModule,
    MatInput,
    MatListModule,
    MatNavList,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './todo-list-page.component.html',
  styleUrl: './todo-list-page.component.scss',
})
export class ToDoListPageComponent {
  private authService = inject(AuthService);
  private toDoListService = inject(ToDoListService);

  username = this.authService.currentUser()?.username;
  toDoLists = signal<ToDoList[]>([]);

  showForm: boolean = false;
  
  constructor() {
    effect( () => {
      this.toDoListService.refreshNeeded();
      this.loadLists();
    } );
  }

  loadLists() {
    this.toDoListService.getLists().subscribe(
      lists => this.toDoLists.set(lists)
    );
  }

  newListForm = new FormGroup({
    name: new FormControl('new list',
      {validators: [
        Validators.required
      ]}
    )
  });

  createNewList() {
    const createListDto: CreateListDto = {
      name: this.newListForm.value.name!
    }
    this.toDoListService.createList(createListDto).subscribe({
      next: () => this.loadLists(),
      error: (err) => console.error(err)
    })
    this.showForm = false;
  }
}
