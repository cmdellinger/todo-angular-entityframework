import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:5000/api/todolists'

  getLists() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
