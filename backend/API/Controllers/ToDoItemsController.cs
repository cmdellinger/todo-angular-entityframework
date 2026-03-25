using System.Security.Claims;
using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoItemsController(IToDoItemRepository itemRepo,
                                     IToDoListRepository listRepo) : ControllerBase
    {
        private string? GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;    
        }
        
        [HttpGet("/api/todolists/{toDoListId:int}/items")]
        public async Task<ActionResult<IList<ToDoItem>>> GetItemList(int toDoListId)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // check parent list ownership and that list exists
            var toDoList = await listRepo.GetListByIdAsync(toDoListId);
            if (toDoList == null) return NotFound();
            if (toDoList.UserId != userId) return Forbid();

            var items = await itemRepo.GetItemsByListAsync(toDoListId);
            return Ok(items.Select(ReturnItemDto.FromEntity).ToList());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReturnItemDto?>> GetItem(int id)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // fetch and check that ToDoItem exists
            var toDoItem = await itemRepo.GetItemByIdAsync(id);
            if (toDoItem == null) return NotFound();
            // check parent list ownership and that list exists
            var toDoList = await listRepo.GetListByIdAsync(toDoItem.ToDoListId);
            if (toDoList == null) return NotFound();
            if (toDoList.UserId != userId) return Forbid();

            return ReturnItemDto.FromEntity(toDoItem);
        }

        [HttpPost("/api/todolists/{listId:int}/items")]
        public async Task<ActionResult<ReturnItemDto>> CreateItem(int listId, NewItemDto newItemDto)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // check that list exists
            var toDoList = await listRepo.GetListByIdAsync(listId);
            if (toDoList == null) return NotFound();
            // check list ownership
            if (toDoList.UserId != userId) return Forbid();
            // create new ToDo
            var newToDoItem = new ToDoItem
            {
                ToDoListId = listId,
                Title = newItemDto.Title,
                Description = newItemDto.Description,
            };
            // add to database and populate other properties in place
            await itemRepo.AddItemAsync(newToDoItem);

            return ReturnItemDto.FromEntity(newToDoItem);
        }

        [HttpPut("/api/items/{id:int}")]
        public async Task<IActionResult> UpdateItem(int id, UpdateItemDto updateItemDto)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // fetch and check item exists
            var toDoItem = await itemRepo.GetItemByIdAsync(id);
            if (toDoItem == null) return NotFound();
            // check parent list ownership and that list exists
            var toDoList = await listRepo.GetListByIdAsync(toDoItem.ToDoListId);
            if (toDoList == null) return NotFound();
            if (toDoList.UserId != userId) return Forbid();
            // update properties
            toDoItem.Title = updateItemDto.Title;
            toDoItem.Description = updateItemDto.Description;
            // if ToDo is completed, set completion time
            if (toDoItem.IsCompleted == false && updateItemDto.IsCompleted == true)
                toDoItem.CompletedAt = DateTimeOffset.UtcNow;
            // if ToDo is un-completed, wipe completion time
            if (toDoItem.IsCompleted == true && updateItemDto.IsCompleted == false)
                toDoItem.CompletedAt = null;
            toDoItem.IsCompleted = updateItemDto.IsCompleted;
            toDoItem.SortOrder = updateItemDto.SortOrder;

            await itemRepo.UpdateItemAsync(toDoItem);
            return NoContent();
        }

        [HttpDelete("/api/items/{id:int}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // fetch and check item exists
            var toDoItem = await itemRepo.GetItemByIdAsync(id);
            if (toDoItem == null) return NotFound();
            // check parent list ownership and that list exists
            var toDoList = await listRepo.GetListByIdAsync(toDoItem.ToDoListId);
            if (toDoList == null) return NotFound();
            if (toDoList.UserId != userId) return Forbid();

            await itemRepo.DeleteItemAsync(toDoItem);
            return NoContent();
        }
    }
}
