using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<ToDoItem> ToDoItems { get; set; }
    public DbSet<ToDoList> ToDoLists { get; set; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = DateTimeOffset.UtcNow;

            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTimeOffset.UtcNow;
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}