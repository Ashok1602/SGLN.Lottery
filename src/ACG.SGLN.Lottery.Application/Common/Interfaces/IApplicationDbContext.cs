using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Incentive> Incentives { get; set; }
        DbSet<Invoice> Invoices { get; set; }

        DbSet<Announcement> Announcements { get; set; }
        DbSet<Notification> Notifications { get; set; }
        DbSet<City> Cities { get; set; }
        DbSet<Request> Requests { get; set; }
        DbSet<RequestDocument> RequestDocuments { get; set; }
        DbSet<RequestStatus> RequestStatuses { get; set; }
        DbSet<RequestComment> RequestComments { get; set; }
        DbSet<Retailer> Retailers { get; set; }
        DbSet<RetailerDocument> RetailerDocuments { get; set; }
        DbSet<Training> Trainings { get; set; }
        DbSet<TrainingDocument> TrainingDocuments { get; set; }
        DbSet<TrainingQuestion> TrainingQuestions { get; set; }
        DbSet<TrainingQuestionOption> TrainingQuestionOptions { get; set; }
        DbSet<TrainingQuestionAnswer> TrainingQuestionAnswers { get; set; }
        DbSet<RetailerTraining> RetailerTrainings { get; set; }
        DbSet<TrainingModule> TrainingModules { get; set; }
        DbSet<RequestObject> RequestObjects { get; set; }
        DbSet<RequestCategory> RequestCategories { get; set; }
        DbSet<RetailerTrainingStatus> RetailerTrainingStatuses { get; set; }
        DbSet<ApplicationDocument> ApplicationDocuments { get; set; }
        DbSet<RetailerNotification> RetailerNotifications { get; set; }

        IQueryable<TEntity> ApplySpecification<TEntity>(ISpecification<TEntity> spec) where TEntity : class;

        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        EntityEntry Entry([NotNull] object entity);

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        Task CommitTransactionAsync(CancellationToken cancellationToken = new CancellationToken());
        Task BeginTransactionAsync();
        void RollbackTransaction();
    }
}