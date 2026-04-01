using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;

public class UpdateItemDto
{
    [Required, MaxLength(100)]
    public required string Title { get; set; }
    [MaxLength(500)]
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int SortOrder { get; set; }
}
