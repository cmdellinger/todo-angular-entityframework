using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Framework Services
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Identity

// CORS
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200");
    });
});

// App services / repositories
builder.Services.AddScoped<IToDoListRepository, ToDoListRepository>();
builder.Services.AddScoped<IToDoItemRepository, ToDoItemRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.

// app.UseHttpsRedirection();

// app.UseAuthorization();
app.UseCors("CorsPolicy");
app.MapControllers();

app.Run();