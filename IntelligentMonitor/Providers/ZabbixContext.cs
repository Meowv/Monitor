using Microsoft.EntityFrameworkCore;

namespace IntelligentMonitor.Providers
{
    public class ZabbixContext : DbContext
    {
        public ZabbixContext(DbContextOptions<ZabbixContext> options) : base(options)
        {
        }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}