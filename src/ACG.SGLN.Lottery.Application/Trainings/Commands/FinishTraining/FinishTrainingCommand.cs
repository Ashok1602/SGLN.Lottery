using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.FinishTraining
{
    public class FinishTrainingCommand : IRequest<Unit>
    {
        public Guid TrainingId { get; set; }
    }

    public class FinishTrainingCommandHandler : IRequestHandler<FinishTrainingCommand, Unit>,
        IApplicationRequestHandler<FinishTrainingCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly ICurrentUserService _currentUserService;

        public FinishTrainingCommandHandler(IApplicationDbContext dbcontext, ICurrentUserService currentUserService)
        {
            _dbcontext = dbcontext;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(FinishTrainingCommand request,
            CancellationToken cancellationToken)
        {
            Training entity = await _dbcontext.Trainings.FindAsync(request.TrainingId);

            if (entity == null)
                throw new NotFoundException(nameof(Training), request.TrainingId);

            Retailer retailer = _dbcontext.Set<Retailer>()
                                    .Where(r => r.UserId == _currentUserService.UserId)
                                    .FirstOrDefault();
            if (retailer == null)
                throw new InvalidOperationException("Seul un compte détaillant peut suivre une formation");

            RetailerTraining retailerTrainingEntity = _dbcontext.RetailerTrainings
                                    .Where(r => r.RetailerId == retailer.Id && r.TrainingId == entity.Id)
                                    .FirstOrDefault();

            if (retailerTrainingEntity == null || retailerTrainingEntity.LastStatus != TrainingStatusType.InProgress)
                throw new InvalidOperationException("Impossible de terminer cette formation !");

            retailerTrainingEntity.LastStatus = TrainingStatusType.CourseFinished;
            _dbcontext.Set<RetailerTrainingStatus>().Add(new RetailerTrainingStatus
            {
                StatusType = TrainingStatusType.CourseFinished,
                RetailerTrainingId = retailerTrainingEntity.Id,
            });

            _dbcontext.Entry(retailerTrainingEntity).State = EntityState.Modified;

            await _dbcontext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}