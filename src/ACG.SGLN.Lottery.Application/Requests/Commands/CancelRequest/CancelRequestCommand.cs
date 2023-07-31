using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.Requests.Commands.CancelRequest
{
    public class CancelRequestCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public string Reason { get; set; }
    }

    public class CancelRequestCommandHandler : IRequestHandler<CancelRequestCommand, Unit>,
        IApplicationRequestHandler<CancelRequestCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;

        public CancelRequestCommandHandler(IApplicationDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<Unit> Handle(CancelRequestCommand request,
            CancellationToken cancellationToken)
        {
            Request entity = await _dbcontext.Requests.FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Request), request.Id);

            if (entity.LastStatus == RequestStatusType.Cancelled || entity.LastStatus == RequestStatusType.Closed)
                throw new InvalidOperationException();

            entity.LastStatus = RequestStatusType.Cancelled;
            _dbcontext.Set<RequestStatus>().Add(new RequestStatus
            {
                RequestId = entity.Id,
                StatusType = RequestStatusType.Cancelled,
                Comment = request.Reason
            });

            _dbcontext.Entry(entity).State = EntityState.Modified;

            await _dbcontext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}