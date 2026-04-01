import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { ToDoList } from '../models/todo-list.model';

import { CreateListDto } from '../dtos/list/create-list.dto';
import { UpdateListDto } from '../dtos/list/update-list.dto';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ToDoListService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;
  private listsUrl(id?: number): string {
    return id ? `${this.apiUrl}/todolists/${id}` : `${this.apiUrl}/todolists`
  }
  refreshNeeded = signal(0);

  getLists() {
    return this.http.get<ToDoList[]>(`${this.listsUrl()}`);
  }

  getList(id: number) {
    return this.http.get<ToDoList>(this.listsUrl(id));
  }

  createList(newList: CreateListDto) {
    return this.http.post<ToDoList>(this.listsUrl(), newList);
  }

  updateList(id: number, list: UpdateListDto) {
    return this.http.put<void>(this.listsUrl(id), list);
  }

  reorderList(id: number, itemOrder: number[]) {
    return this.http.put<void>(this.listsUrl(id) + "/reorder", itemOrder)
  }

  deleteList(id: number) {
    return this.http.delete<void>(this.listsUrl(id));
  }

  triggerRefresh() {
    this.refreshNeeded.update(v => v + 1);
  }
}
