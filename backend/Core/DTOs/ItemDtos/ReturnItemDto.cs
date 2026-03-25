using Core.Entities;

namespace Core.DTOs;
public class ReturnItemDto
{
    public required int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public int SortOrder { get; set; }

    public static ReturnItemDto FromEntity(ToDoItem item)
    {
        return new ReturnItemDto
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            IsCompleted = item.IsCompleted,
            CompletedAt = item.CompletedAt,
            SortOrder = item.SortOrder
        };
    }
}
