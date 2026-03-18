import { ToDoItem } from "./todo-item.model"

export interface ToDoList {
    // to-do list data
    id: number;
    name: string;
    userId: string;
    items: ToDoItem[];
    // metadata
    createdAt: string;
    updatedAt?: string;
}
