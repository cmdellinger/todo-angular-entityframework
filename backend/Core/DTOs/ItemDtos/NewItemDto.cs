using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;

public class NewItemDto
{
    [Required, MaxLength(100)]
    public required string Title { get; set; }
    [MaxLength(500)]
    public string? Description { get; set; } = null;
}