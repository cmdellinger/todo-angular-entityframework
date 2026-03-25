namespace Core.DTOs;

public class UpdateItemDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int SortOrder { get; set; }
}
