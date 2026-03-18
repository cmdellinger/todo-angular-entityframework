import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoListDetailComponent } from './todo-list-detail.component';

describe('TodoListDetailComponent', () => {
  let component: ToDoListDetailComponent;
  let fixture: ComponentFixture<ToDoListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoListDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoListDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
