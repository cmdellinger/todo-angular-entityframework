using System.Security.Claims;
using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoListsController(IToDoListRepository repo) : ControllerBase
    {
        private string? GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;    
        }

        [HttpGet]
        public async Task<ActionResult<IList<ReturnListDto>>> GetLists()
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            
            var lists = await repo.GetListsByUserAsync(userId);
            return Ok(lists.Select(ReturnListDto.FromEntity).ToList());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReturnListDto>> GetList(int id)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // check that list exists
            var toDoList = await repo.GetListByIdAsync(id);
            if (toDoList == null) return NotFound();
            // check list ownership
            if (toDoList.UserId != userId) return Forbid();
           
            return ReturnListDto.FromEntity(toDoList);
        }

        [HttpPost]
        public async Task<ActionResult<ReturnListDto>> CreateList(NewListDto newListDto)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // extract minimum required fields
            var toDoList = new ToDoList
            {
                Name = newListDto.Name,
                UserId = userId
            };
            // submit to database and get id/timestamps (in-place)
            await repo.AddListAsync(toDoList);
            return ReturnListDto.FromEntity(toDoList);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateList(int id, UpdateListDto updateListDto)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // check that list exists
            var existingList = await repo.GetListByIdAsync(id);
            if (existingList is null) return NotFound();
            // check list ownership
            if (existingList.UserId != userId) return Forbid();

            if (string.IsNullOrEmpty(updateListDto.Name)) return BadRequest();
            existingList.Name = updateListDto.Name;
            
            await repo.UpdateListAsync(existingList);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            // check logged in user
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            // check that list exists
            var toDoList = await repo.GetListByIdAsync(id);
            if (toDoList == null) return NotFound();
            // check list ownership
            if (toDoList.UserId != userId) return Forbid();

            await repo.DeleteListAsync(toDoList);
            return NoContent();
        }
    }
}
