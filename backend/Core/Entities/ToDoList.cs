using System;

namespace Core.Entities;

public class ToDoList : BaseEntity
{
    public required string Name { get; set; }
    public ICollection<ToDoItem> Items { get; set; } = [];
    public string UserId { get; set; } = null!;
}
