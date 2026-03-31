import { TestBed } from '@angular/core/testing';

import { ToDoItemService } from './todo-item.service';

describe('TodoItem', () => {
  let service: ToDoItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToDoItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
