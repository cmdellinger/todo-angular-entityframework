using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ToDoItemRepository(AppDbContext _context) : IToDoItemRepository
{
    public async Task<ToDoItem> AddItemAsync(ToDoItem toDoItem)
    {
        _context.ToDoItems.Add(toDoItem);
        await _context.SaveChangesAsync();
        return toDoItem;
    }

    public async Task DeleteItemAsync(ToDoItem toDoItem)
    {
        _context.ToDoItems.Remove(toDoItem);
        await _context.SaveChangesAsync();
    }

    public async Task<ToDoItem?> GetItemByIdAsync(int itemId)
    {
        return await _context.ToDoItems.FindAsync(itemId);
    }

    public async Task<IList<ToDoItem>> GetItemsByListAsync(int toDoListId)
    {
        return await _context.ToDoItems
            .Where(toDoItem => toDoItem.ToDoListId == toDoListId)
            .ToListAsync();
    }

    public async Task UpdateItemAsync(ToDoItem toDoItem)
    {
        _context.Entry(toDoItem).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
}
