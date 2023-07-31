using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Infrastructure.Identity.Entities;
using ACG.SGLN.Lottery.Infrastructure.Persistence.Configurations;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Extensions;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string,
            ApplicationUserClaim, ApplicationUserRole, ApplicationUserLogin, ApplicationRoleClaim, ApplicationUserToken
        >,
        IPersistedGrantDbContext, IApplicationDbContext
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IDateTime _dateTime;
        private readonly IStorage _storage;
        private readonly IOptions<OperationalStoreOptions> _operationalStoreOptions;
        private IDbContextTransaction _currentTransaction;

        private static readonly MethodInfo SetGlobalQueryMethod = typeof(ApplicationDbContext).GetMethods(BindingFlags.NonPublic | BindingFlags.Instance).Single(t => t.IsGenericMethod && t.Name == "SetGlobalQuery");

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions,
            ICurrentUserService currentUserService,
            IDateTime dateTime, IStorage storage) : base(options)
        {
            _operationalStoreOptions = operationalStoreOptions;
            _currentUserService = currentUserService;
            _dateTime = dateTime;
            _storage = storage;
        }

        public DbSet<Incentive> Incentives { get; set; }
        public DbSet<Invoice> Invoices { get; set; }

        public DbSet<ApplicationDocument> ApplicationDocuments { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<RetailerNotification> RetailerNotifications { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<RequestComment> RequestComments { get; set; }
        public DbSet<RequestDocument> RequestDocuments { get; set; }
        public DbSet<RequestStatus> RequestStatuses { get; set; }
        public DbSet<Retailer> Retailers { get; set; }
        public DbSet<RetailerDocument> RetailerDocuments { get; set; }
        public DbSet<Training> Trainings { get; set; }
        public DbSet<TrainingQuestion> TrainingQuestions { get; set; }
        public DbSet<TrainingQuestionOption> TrainingQuestionOptions { get; set; }
        public DbSet<TrainingQuestionAnswer> TrainingQuestionAnswers { get; set; }
        public DbSet<TrainingDocument> TrainingDocuments { get; set; }
        public DbSet<RetailerTraining> RetailerTrainings { get; set; }
        public DbSet<TrainingModule> TrainingModules { get; set; }
        public DbSet<RequestObject> RequestObjects { get; set; }
        public DbSet<RequestCategory> RequestCategories { get; set; }
        public DbSet<RetailerTrainingStatus> RetailerTrainingStatuses { get; set; }

        private void SetGlobalQuery<TEntity>(ModelBuilder builder) where TEntity : class, IDeletableEntity
        {
            builder.Entity<TEntity>().HasQueryFilter(b => !(b.IsDeleted ?? false));
        }

        //private Size ResizeKeepAspect(Size src, int maxWidth, int maxHeight, bool enlarge = false)
        //{
        //    maxWidth = enlarge ? maxWidth : Math.Min(maxWidth, src.Width);
        //    maxHeight = enlarge ? maxHeight : Math.Min(maxHeight, src.Height);

        //    decimal rnd = Math.Min(maxWidth / (decimal)src.Width, maxHeight / (decimal)src.Height);
        //    return new Size((int)Math.Round(src.Width * rnd), (int)Math.Round(src.Height * rnd));
        //}

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            var userId = $"{null}:{null}:{null}";
            if (_currentUserService.IsLoggedIn())
                if (_currentUserService.RoleNames != null)
                    userId = $"{_currentUserService.UserName}:{_currentUserService.UserId}:{string.Join(',', _currentUserService.RoleNames)}";
                else
                    userId = $"{_currentUserService.UserName}:{_currentUserService.UserId}:{null}";

            foreach (var entry in ChangeTracker.Entries<IAuditableEntity<string>>())
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedBy = userId;
                        entry.Entity.Created = _dateTime.Now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModifiedBy = userId;
                        entry.Entity.LastModified = _dateTime.Now;
                        break;
                }

            //Need to configure mount dir on server @hassan 
            //foreach (var entry in ChangeTracker.Entries<AbstractDocument>().ToList().Where(e=>e.State == EntityState.Added))
            //{
            //    if (entry.Entity.Data != null && entry.Entity.Data.Count() != 0)
            //    {
            //        entry.Entity.Uri = SaveDocumentDataAsync(entry.Entity).GetAwaiter().GetResult();
            //    }
            //    entry.Entity.Id = Guid.NewGuid();
            //    entry.Entity.Data = null;
            //}

            return base.SaveChangesAsync(cancellationToken);
        }

        private async Task<string> SaveDocumentDataAsync(AbstractDocument entity)
        {
            using (Stream stream = new MemoryStream(entity.Data))
            {
                return await _storage.SaveFileAsync(stream, entity.Type.ToString("G").ToLower(), entity.Id.ToString());
            }
        }

        public async Task BeginTransactionAsync()
        {
            if (_currentTransaction != null) return;

            _currentTransaction = await base.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted)
                .ConfigureAwait(false);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            try
            {
                await SaveChangesAsync(cancellationToken).ConfigureAwait(false);

                _currentTransaction?.Commit();
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
            finally
            {
                if (_currentTransaction != null)
                {
                    _currentTransaction.Dispose();
                    _currentTransaction = null;
                }
            }
        }

        public void RollbackTransaction()
        {
            try
            {
                _currentTransaction?.Rollback();
            }
            finally
            {
                if (_currentTransaction != null)
                {
                    _currentTransaction.Dispose();
                    _currentTransaction = null;
                }
            }
        }

        public IQueryable<TEntity> ApplySpecification<TEntity>(ISpecification<TEntity> spec) where TEntity : class
        {
            return SpecificationEvaluator<TEntity>.GetQuery(Set<TEntity>().AsQueryable(), spec);
        }

        public DbSet<PersistedGrant> PersistedGrants { get; set; }
        public DbSet<DeviceFlowCodes> DeviceFlowCodes { get; set; }

        Task<int> IPersistedGrantDbContext.SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<RetailerNotification>().HasKey(c => new { c.RetailerId, c.NotificationId });
            builder.ConfigurePersistedGrantContext(_operationalStoreOptions.Value);
            builder.ApplyBaseEntityConfiguration();
            builder.ApplyRefEntityConfiguration();
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            builder.Entity<ApplicationUser>(b =>
            {
                // Each User can have many UserClaims
                b.HasMany(e => e.Claims)
                    .WithOne(e => e.User)
                    .HasForeignKey(uc => uc.UserId)
                    .IsRequired();

                // Each User can have many UserLogins
                b.HasMany(e => e.Logins)
                    .WithOne(e => e.User)
                    .HasForeignKey(ul => ul.UserId)
                    .IsRequired();

                // Each User can have many UserTokens
                b.HasMany(e => e.Tokens)
                    .WithOne(e => e.User)
                    .HasForeignKey(ut => ut.UserId)
                    .IsRequired();

                // Each User can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            builder.Entity<ApplicationRole>(b =>
            {
                // Each Role can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                // Each Role can have many associated RoleClaims
                b.HasMany(e => e.RoleClaims)
                    .WithOne(e => e.Role)
                    .HasForeignKey(rc => rc.RoleId)
                    .IsRequired();
            });

            var cascadeFKs = builder.Model.GetEntityTypes().SelectMany(t => t.GetForeignKeys())
                .Where(fk => !fk.IsOwnership && fk.DeleteBehavior == DeleteBehavior.Cascade);
            foreach (var fk in cascadeFKs)
            {
                fk.DeleteBehavior = DeleteBehavior.Restrict;
            }

            foreach (var entity in builder.Model.GetEntityTypes()
                .Where(e => typeof(IDeletableEntity).IsAssignableFrom(e.ClrType)))
            {
                SetGlobalQueryMethod.MakeGenericMethod(entity.ClrType).Invoke(this, new object[] { builder });
            }

        }
    }
}