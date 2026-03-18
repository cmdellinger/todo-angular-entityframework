using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoItemsController(IToDoItemRepository _repo) : ControllerBase
    {
        [HttpGet("/api/todolists/{toDoListId:int}/items")]
        public async Task<ActionResult<IList<ToDoItem>>> GetItemList(int toDoListId)
        {
            return Ok(await _repo.GetItemsByListAsync(toDoListId));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ToDoItem?>> GetItem(int id)
        {
            var toDoItem = await _repo.GetItemByIdAsync(id);
            if (toDoItem == null) return NotFound();
            return toDoItem;
        }

        [HttpPost("/api/todolists/{listId:int}/items")]
        public async Task<ActionResult<ToDoItem>> CreateItem(int listId, [FromBody] ToDoItem toDoItem)
        {
            if (listId != toDoItem.ToDoListId) return BadRequest();
            await _repo.AddItemAsync(toDoItem);
            return toDoItem;
        }

        [HttpPut("/api/items/{id:int}")]
        public async Task<IActionResult> UpdateItem(int id, ToDoItem toDoItem)
        {
            if (id != toDoItem.Id) return BadRequest();
            await _repo.UpdateItemAsync(toDoItem);
            return NoContent();
        }

        [HttpDelete("/api/items/{id:int}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var toDoItem = await _repo.GetItemByIdAsync(id);
            if (toDoItem == null) return NotFound();
            await _repo.DeleteItemAsync(toDoItem);
            return NoContent();
        }
    }
}
