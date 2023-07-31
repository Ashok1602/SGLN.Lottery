using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Notifications;
using ACG.SGLN.Lottery.Application.Notifications.Commands.CreateNotification;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.PublishTraining
{
    public class ToggleTrainingStatusCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public bool IsPublished { get; set; }

    }

    public class PublishTrainingCommandHandler : IRequestHandler<ToggleTrainingStatusCommand, Unit>,
        IApplicationRequestHandler<ToggleTrainingStatusCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly IMediator _mediator;

        public PublishTrainingCommandHandler(IApplicationDbContext dbcontext, IMediator mediator)
        {
            _mediator = mediator;
            _dbcontext = dbcontext;
        }

        public async Task<Unit> Handle(ToggleTrainingStatusCommand request,
            CancellationToken cancellationToken)
        {
            Training entity = await _dbcontext.Trainings.FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Training), request.Id);

            entity.IsPublished = request.IsPublished;

            _dbcontext.Entry(entity).State = EntityState.Modified;

            await _dbcontext.SaveChangesAsync(cancellationToken);

            if (entity.IsPublished)
            {
                try
                {
                    NotificationDto notificationDto = new NotificationDto()
                    {
                        Title = "Une nouvelle formation est publiée",
                        Body = $"Une nouvelle formation ayant comme objet {entity.Title.Split('|')[1]}, soumise le {entity.Created.ToShortDateString()} est publiée.",
                        TargetScreen = NotificationTargetType.TrainingAreaScreen,
                        TargetId = entity.Id
                    };
                    await _mediator.Send(new CreateNotificationCommand { Data = notificationDto });
                }
                catch { }
            }

            return Unit.Value;
        }
    }
}