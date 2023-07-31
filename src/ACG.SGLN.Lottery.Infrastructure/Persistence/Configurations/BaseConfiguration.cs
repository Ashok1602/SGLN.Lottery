using ACG.SGLN.Lottery.Domain.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Reflection;

namespace ACG.SGLN.Lottery.Infrastructure.Persistence.Configurations
{
    public static class BaseEntityConfiguration
    {
        private static void Configure<TEntity, T>(ModelBuilder modelBuilder)
            where TEntity : BaseEntity<T>
        {
            modelBuilder.Entity<TEntity>(builder =>
            {
                builder.HasKey(e => e.Id);
                builder.Property(e => e.Id).ValueGeneratedOnAdd();
            });
        }

        public static ModelBuilder ApplyBaseEntityConfiguration(this ModelBuilder modelBuilder)
        {
            var method = typeof(BaseEntityConfiguration).GetTypeInfo().DeclaredMethods
                .Single(m => m.Name == nameof(Configure));
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
                if (entityType.ClrType.IsBaseEntity(out var T))
                    method.MakeGenericMethod(entityType.ClrType, T).Invoke(null, new[] { modelBuilder });

            return modelBuilder;
        }

        private static bool IsBaseEntity(this Type type, out Type T)
        {
            for (var baseType = type.BaseType; baseType != null; baseType = baseType.BaseType)
                if (baseType.IsGenericType && baseType.GetGenericTypeDefinition() == typeof(BaseEntity<>))
                {
                    T = baseType.GetGenericArguments()[0];
                    return true;
                }

            T = null;
            return false;
        }
    }
}