using Core.Entities;

namespace Core.DTOs;

public class ReturnListDto
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public ICollection<ReturnItemDto> Items { get; set; } = [];
    public DateTimeOffset CreatedAt { get; set; }

    public static ReturnListDto FromEntity(ToDoList list)
    {
        return new ReturnListDto
        {
          Id = list.Id,
          Name = list.Name,
          Items = list.Items.Select(ReturnItemDto.FromEntity).ToList(),
          CreatedAt = list.CreatedAt
        };
    }
}
