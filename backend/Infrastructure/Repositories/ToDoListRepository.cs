using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ToDoListRepository(AppDbContext _context) : IToDoListRepository
{
    public async Task<ToDoList> AddListAsync(ToDoList toDoList)
    {
        _context.ToDoLists.Add(toDoList);
        await _context.SaveChangesAsync();
        return toDoList;
    }

    public async Task DeleteListAsync(ToDoList toDoList)
    {
        _context.ToDoLists.Remove(toDoList);
        await _context.SaveChangesAsync();
    }

    public async Task<ToDoList?> GetListByIdAsync(int listId)
    {
        return await _context.ToDoLists.FindAsync(listId);
    }

    public async Task<IList<ToDoList>> GetListsByUserAsync(string userId)
    {
        return await _context.ToDoLists
            .Where(toDoList => toDoList.UserId == userId)
            .ToListAsync();
    }

    public async Task UpdateListAsync(ToDoList toDoList)
    {
        _context.Entry(toDoList).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
}
