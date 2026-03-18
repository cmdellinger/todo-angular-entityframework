import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDoList } from '../models/todo-list.model';

@Injectable({
  providedIn: 'root',
})
export class ToDoListService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';
  private listsUrl(id?: number): string {
    return id ? `${this.apiUrl}/todolists/${id}` : `${this.apiUrl}/todolists`
  }

  getLists(userId: string) {
    return this.http.get<ToDoList[]>(`${this.listsUrl()}?userId=${userId}`);
  }

  getList(id: number) {
    return this.http.get<ToDoList>(this.listsUrl(id));
  }

  createList(newList: ToDoList) {
    return this.http.post<ToDoList>(this.listsUrl(), newList);
  }

  updateList(id: number, list: ToDoList) {
    return this.http.put<void>(this.listsUrl(id), list);
  }

  deleteList(id: number) {
    return this.http.delete<void>(this.listsUrl(id));
  }
}
