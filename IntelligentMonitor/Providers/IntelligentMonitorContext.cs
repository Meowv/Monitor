using IntelligentMonitor.Models.Users;
using Microsoft.EntityFrameworkCore;

namespace IntelligentMonitor.Providers
{
    public class IntelligentMonitorContext : DbContext
    {
        public IntelligentMonitorContext(DbContextOptions<IntelligentMonitorContext> options) : base(options)
        {
        }

        public DbSet<Roles> Roles { get; set; }

        public DbSet<Permissions> Permissions { get; set; }

        public DbSet<Models.Charts.Charts> Charts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}