using Core.Entities;

namespace Core.Interfaces;

public interface IToDoItemRepository
{
    Task<IList<ToDoItem>> GetItemsByListAsync(int toDoListId);
    Task<ToDoItem?> GetItemByIdAsync(int itemId);
    Task<ToDoItem> AddItemAsync(ToDoItem toDoItem);
    Task UpdateItemAsync(ToDoItem toDoItem);
    Task DeleteItemAsync(ToDoItem toDoItem);
}