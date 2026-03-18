import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDoItem } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root',
})
export class ToDoItemService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';
  private itemsUrl(listId: number): string {
    return `${this.apiUrl}/todolists/${listId}/items`;
  }

  private itemUrl(id: number): string {
    return `${this.apiUrl}/items/${id}`;
  }

  getItems(listId: number) {
    return this.http.get<ToDoItem[]>(this.itemsUrl(listId));
  }

  getItem(id: number) {
    return this.http.get<ToDoItem>(this.itemUrl(id));
  }

  addItem(listId: number, newToDoItem: ToDoItem) {
    return this.http.post<ToDoItem>(this.itemsUrl(listId), newToDoItem);
  }

  updateItem(id: number, updatedToDoItem: ToDoItem) {
    return this.http.put<void>(this.itemUrl(id), updatedToDoItem);
  }

  deleteItem(id: number) {
    return this.http.delete<void>(this.itemUrl(id));
  }
}
