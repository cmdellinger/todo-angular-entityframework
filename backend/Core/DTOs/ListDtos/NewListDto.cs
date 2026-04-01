using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;

public class NewListDto
{
    [Required, MaxLength(100)]
    public required string Name { get; set; }
}
