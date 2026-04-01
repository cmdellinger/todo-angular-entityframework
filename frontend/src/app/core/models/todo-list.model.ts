import { ToDoItem } from "./todo-item.model"

export interface ToDoList {
    id: number;
    name: string;
    items: ToDoItem[];
    createdAt: string;
    activeItemCount: number;
}
