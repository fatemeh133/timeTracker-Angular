using Microsoft.EntityFrameworkCore;
using UsersApi.Models;

namespace UsersApi.Moleds

{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        public DbSet<UserInfo> Users { get; set; } = null!;
        public DbSet<TaskInfo> Tasks { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    // Set default value for IsChecked column
        //    modelBuilder.Entity<TaskInfo>()
        //        .Property(t => t.IsChecked)
        //        .HasDefaultValue(false);
        //}
    }


}
