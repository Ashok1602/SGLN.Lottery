using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.StartTraining
{
    public class StartTrainingCommand : IRequest<Unit>
    {
        public Guid TrainingId { get; set; }
    }

    public class StartTrainingCommandHandler : IRequestHandler<StartTrainingCommand, Unit>,
        IApplicationRequestHandler<StartTrainingCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly ICurrentUserService _currentUserService;

        public StartTrainingCommandHandler(IApplicationDbContext dbcontext, ICurrentUserService currentUserService)
        {
            _dbcontext = dbcontext;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(StartTrainingCommand request,
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

            if (retailerTrainingEntity != null)
            {
                if (retailerTrainingEntity.LastStatus == TrainingStatusType.CourseFinished || retailerTrainingEntity.LastStatus == TrainingStatusType.InProgress)
                    throw new InvalidOperationException("Vous avez déjà commencé cette formation !");

                if (retailerTrainingEntity.LastStatus == TrainingStatusType.TestCompleted && retailerTrainingEntity.ScoreRate >= 50)
                    throw new InvalidOperationException("Vous avez déjà passé cette formation avec succès !");

                retailerTrainingEntity.LastStatus = TrainingStatusType.InProgress;
                retailerTrainingEntity.Score = null;
                retailerTrainingEntity.ScoreRate = null;
                _dbcontext.Set<RetailerTrainingStatus>().Add(new RetailerTrainingStatus
                {
                    StatusType = TrainingStatusType.InProgress,
                    RetailerTrainingId = retailerTrainingEntity.Id,
                });

                _dbcontext.Entry(retailerTrainingEntity).State = EntityState.Modified;
                await _dbcontext.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }

            RetailerTraining retailerTraining = new RetailerTraining
            {
                Retailer = retailer,
                Training = entity,
                LastStatus = TrainingStatusType.InProgress,
                Statuses = new List<RetailerTrainingStatus>
                    {
                        new RetailerTrainingStatus { StatusType = TrainingStatusType.InProgress }
                    }
            };
            _dbcontext.Set<RetailerTraining>().Add(retailerTraining);
            await _dbcontext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}