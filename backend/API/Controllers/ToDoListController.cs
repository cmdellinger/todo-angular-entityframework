using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoListController : ControllerBase
    {
        private readonly AppDbContext context;
        public ToDoListController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoList>>> GetToDoLists()
        {
            return await context.ToDoLists.ToListAsync();
        }

        [HttpGet("{id:int}")] // api/todolists/2
        public async Task<ActionResult<ToDoList>> GetToDoList(int id)
        {
            var toDoList = await context.ToDoLists.FindAsync(id);
            
            if (toDoList == null) return NotFound();

            return toDoList;
        }

        [HttpPost]
        public async Task<ActionResult<ToDoList>> CreateToDoList(ToDoList toDoList)
        {
            context.ToDoLists.Add(toDoList);

            await context.SaveChangesAsync();

            return toDoList;
        }
    }
}
