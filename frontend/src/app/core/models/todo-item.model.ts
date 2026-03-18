export interface ToDoItem {
    // to-do data
    id: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    // list vars
    sortOrder: number;
    toDoListId:number;
    // metadata
    completedAt?: string;
    createdAt: string;
    updatedAt?: string;
}
