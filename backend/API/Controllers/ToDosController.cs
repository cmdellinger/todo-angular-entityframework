using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDosController : ControllerBase
    {
        private readonly AppDbContext context;

        public ToDosController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetToDoItems()
        {
            return await context.ToDoItems.ToListAsync();
        }

        [HttpGet("{id:int}")] // api/todoitems/2
        public async Task<ActionResult<ToDoItem>> GetToDoItem(int id)
        {
            var toDoItem = await context.ToDoItems.FindAsync(id);
            
            if (toDoItem == null) return NotFound();

            return toDoItem;
        }

        [HttpPost]
        public async Task<ActionResult<ToDoItem>> CreateToDoItem(ToDoItem toDoItem)
        {
            context.ToDoItems.Add(toDoItem);

            await context.SaveChangesAsync();

            return toDoItem;
        }
    }
}
