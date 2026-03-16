using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoListsController(IToDoListRepository _repo) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IList<ToDoList>>> GetLists(string userId)
        {
            return Ok(await _repo.GetListsByUserAsync(userId));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ToDoList>> GetList(int id)
        {
            var toDoList = await _repo.GetListByIdAsync(id);
            if (toDoList == null) return NotFound();
            return toDoList;
        }

        [HttpPost]
        public async Task<ActionResult<ToDoList>> CreateList(ToDoList toDoList)
        {
            await _repo.AddListAsync(toDoList);
            return toDoList;
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateList(int id, ToDoList toDoList)
        {
            if (id != toDoList.Id) return BadRequest();
            await _repo.UpdateListAsync(toDoList);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            var toDoList = await _repo.GetListByIdAsync(id);
            if (toDoList == null) return NotFound();
            await _repo.DeleteListAsync(toDoList);
            return NoContent();
        }
    }
}
