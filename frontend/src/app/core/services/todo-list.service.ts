import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToDoList } from '../models/todo-list.model';
import { CreateListDto } from '../dtos/list/create-list.dto';
import { UpdateListDto } from '../dtos/list/update-list.dto';

@Injectable({
  providedIn: 'root',
})
export class ToDoListService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';
  private listsUrl(id?: number): string {
    return id ? `${this.apiUrl}/todolists/${id}` : `${this.apiUrl}/todolists`
  }

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

  deleteList(id: number) {
    return this.http.delete<void>(this.listsUrl(id));
  }
}
