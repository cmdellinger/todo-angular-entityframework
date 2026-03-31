import { Component, inject, OnInit, signal } from '@angular/core';
import { ToDoListService } from '../../../core/services/todo-list.service';
import { ToDoListComponent } from "../todo-list/todo-list.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateListDto } from '../../../core/dtos/list/create-list.dto';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToDoList } from '../../../core/models/todo-list.model';

@Component({
  selector: 'app-todo-list-page',
  imports: [
    ToDoListComponent,
    ReactiveFormsModule
  ],
  templateUrl: './todo-list-page.component.html',
  styleUrl: './todo-list-page.component.scss',
})
export class ToDoListPageComponent implements OnInit {
  private authService = inject(AuthService);
  private toDoListService = inject(ToDoListService);
  private router = inject(Router);

  username = this.authService.currentUser()?.username;
  toDoLists = signal<ToDoList[]>([]);
  
  ngOnInit() {
    this.loadLists();
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
  }

  logout() {
    this.authService.logout().subscribe(
      () => this.router.navigate(['/login'])
    );
  }
}
