using ACG.SGLN.Lottery.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ACG.SGLN.Lottery.Infrastructure.Persistence.Configurations
{
    public static class RefEntityConfiguration
    {
        public static ModelBuilder ApplyRefEntityConfiguration(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<City>().HasKey(e => e.Id);
            modelBuilder.Entity<City>().HasIndex(e => e.NormalizedTitle).IsUnique();
            modelBuilder.Entity<City>().Property(e => e.Id).ValueGeneratedOnAdd();

            //modelBuilder.Entity<VehicleModel>().HasIndex(e => e.Name).IsUnique();

            return modelBuilder;
        }
    }
}