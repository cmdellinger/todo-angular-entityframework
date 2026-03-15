namespace Core.Entities;

public class ToDoItem : BaseEntity
{
    public required int ToDoListId { get; set; }
    public ToDoList ToDoList { get; set; } = null!;
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
}
