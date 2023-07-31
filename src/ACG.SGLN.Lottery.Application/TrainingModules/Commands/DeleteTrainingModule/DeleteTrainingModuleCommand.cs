using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.TrainingModules.Commands.DeleteTrainingModule
{
    public class DeleteTrainingModuleCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteTrainingModuleCommandHandler : IRequestHandler<DeleteTrainingModuleCommand, Unit>,
        IApplicationRequestHandler<DeleteTrainingModuleCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public DeleteTrainingModuleCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteTrainingModuleCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<TrainingModule>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(TrainingModule), request.Id);

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
