using Microsoft.EntityFrameworkCore;
using SA.Shield.Core.Models;
using SA.Shield.Operations.Models;

namespace SA.Shield.Operations
{
    public class OperationsDbContext : DbContext
    {
        public DbSet<WipJobAllLab> WipJobAllLab { get; set; }

        public DbSet<WipCurrentOp> WipCurrentOps { get; set; }

        public DbSet<WipJobPickList> WipJobPickList { get; set; }

        public DbSet<WipMaster> WipMasters { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var server = Environment.GetEnvironmentVariable("SYSPRO_DB_SERVER");
            var database = Environment.GetEnvironmentVariable("SYSPRO_DB_NAME");
            var userId = Environment.GetEnvironmentVariable("SYSPRO_DB_USERID");
            var password = Environment.GetEnvironmentVariable("SYSPRO_DB_PASSWORD");
            var connectionString = $"Server={server};Database={database};User ID={userId};Password={password};";
            optionsBuilder.UseSqlServer(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WipJobAllLab>()
                .HasKey(w => new { w.Job, w.Operation });
        }
    }
}
