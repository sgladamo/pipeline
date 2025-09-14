using Microsoft.EntityFrameworkCore;
using SA.Shield.Despatch.Models;

namespace SA.Shield.Despatch
{
    public class DespatchDbContext : DbContext
    {
        public DbSet<DespDashboard> DespDashboard { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var server = Environment.GetEnvironmentVariable("SYSPRO_DB_SERVER");
            var database = Environment.GetEnvironmentVariable("SYSPRO_DB_NAME");
            var userId = Environment.GetEnvironmentVariable("SYSPRO_DB_USERID");
            var password = Environment.GetEnvironmentVariable("SYSPRO_DB_PASSWORD");
            var connectionString = $"Server={server};Database={database};User ID={userId};Password={password};";
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
}