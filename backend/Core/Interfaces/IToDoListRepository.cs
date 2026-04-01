using Core.Entities;

namespace Core.Interfaces;

public interface IToDoListRepository
{
    Task<IList<ToDoList>> GetListsByUserAsync(string userId);
    Task<ToDoList?> GetListByIdAsync(int listId);
    Task<ToDoList> AddListAsync(ToDoList toDoList);
    Task UpdateListAsync(ToDoList toDoList);
    Task UpdateSortOrderAsync(int listId, List<int> itemIds);
    Task DeleteListAsync(ToDoList toDoList);
}
