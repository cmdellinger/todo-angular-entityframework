export interface ToDoItem {
    id: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    completedAt?: string;
    sortOrder: number;
}