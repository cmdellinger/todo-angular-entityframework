import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListService } from './core/services/todo-list';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
   
  private todoListService = inject(TodoListService);

  lists = toSignal(this.todoListService.getLists(), { initialValue: [] as any[] });
}
