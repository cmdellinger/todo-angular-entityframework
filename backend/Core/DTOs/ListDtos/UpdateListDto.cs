using System.ComponentModel.DataAnnotations;

namespace Core.DTOs;

public class UpdateListDto
{
    [Required, MaxLength(100)]
    public required string Name { get; set; }
}
