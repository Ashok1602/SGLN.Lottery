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

namespace ACG.SGLN.Lottery.Application.Announcements.Commands.TogglePublishStatus
{
    public class TogglePublishStatusCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }

        public bool IsPublished { get; set; }
    }

    public class TogglePublishStatusCommandHandler : IRequestHandler<TogglePublishStatusCommand, Unit>,
        IApplicationRequestHandler<TogglePublishStatusCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly IMediator _mediator;

        public TogglePublishStatusCommandHandler(IApplicationDbContext dbcontext, IMediator mediator)
        {
            _dbcontext = dbcontext;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(TogglePublishStatusCommand request,
            CancellationToken cancellationToken)
        {
            Announcement entity = await _dbcontext.Announcements.FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Announcement), request.Id);

            entity.IsPublished = request.IsPublished;

            _dbcontext.Entry(entity).State = EntityState.Modified;

            await _dbcontext.SaveChangesAsync(cancellationToken);

            if (entity.IsPublished)
            {
                try
                {
                    NotificationDto notificationDto = new NotificationDto()
                    {
                        Title = "Une nouvelle annonce est publiée",
                        Body = entity.Title + " : " + entity.Body,
                        TargetScreen = NotificationTargetType.AnnoucementsDetails,
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