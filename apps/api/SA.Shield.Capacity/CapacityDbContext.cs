using Microsoft.EntityFrameworkCore;
using SA.Shield.Capacity.Models;
using SA.Shield.Core.Models;

namespace SA.Shield.Capacity
{
    public class CapacityDbContext : DbContext
    {
        public DbSet<CapacityDay> CapacityDays { get; set; }

        public DbSet<CapacityJob> CapacityJobs { get; set; }

        public DbSet<CapacityLostHours> CapacityLostHours { get; set; }

        public DbSet<WipAssemblyTime> WipAssemblyTimes { get; set; }

        public DbSet<WipMaster> WipMasters { get; set; }

        public DbSet<WipJobAllLab> WipJobAllLabs { get; set; }

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
