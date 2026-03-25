namespace Core.DTOs;

public class NewItemDto
{
    public required string Title { get; set; }
    public string? Description { get; set; } = null;
}