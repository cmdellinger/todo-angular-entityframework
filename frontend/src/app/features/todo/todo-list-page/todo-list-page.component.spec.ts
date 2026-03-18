import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoListPageComponent } from './todo-list-page.component';

describe('TodoListPageComponent', () => {
  let component: ToDoListPageComponent;
  let fixture: ComponentFixture<ToDoListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoListPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
