import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ToDoItem } from '../models/todo-item.model';

import { CreateItemDto } from '../dtos/item/create-item.dto';
import { UpdateItemDto } from '../dtos/item/update-item.dto';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ToDoItemService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;
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

  addItem(listId: number, newToDoItem: CreateItemDto) {
    return this.http.post<ToDoItem>(this.itemsUrl(listId), newToDoItem);
  }

  updateItem(id: number, updatedToDoItem: UpdateItemDto) {
    return this.http.put<void>(this.itemUrl(id), updatedToDoItem);
  }

  deleteItem(id: number) {
    return this.http.delete<void>(this.itemUrl(id));
  }
}
