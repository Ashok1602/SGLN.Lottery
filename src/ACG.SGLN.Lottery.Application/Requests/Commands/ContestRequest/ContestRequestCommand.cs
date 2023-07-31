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

namespace ACG.SGLN.Lottery.Application.Requests.Commands.ContestRequest
{
    public class ContestRequestCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public string Reason { get; set; }
    }

    public class ContestRequestCommandHandler : IRequestHandler<ContestRequestCommand, Unit>,
        IApplicationRequestHandler<ContestRequestCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;

        public ContestRequestCommandHandler(IApplicationDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<Unit> Handle(ContestRequestCommand request,
            CancellationToken ContestlationToken)
        {
            Request entity = await _dbcontext.Requests.FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Request), request.Id);

            if (entity.LastStatus != RequestStatusType.Closed)
                throw new InvalidOperationException();

            entity.LastStatus = RequestStatusType.Contested;
            _dbcontext.Set<RequestStatus>().Add(new RequestStatus
            {
                RequestId = entity.Id,
                StatusType = RequestStatusType.Contested,
                Comment = request.Reason
            });

            _dbcontext.Entry(entity).State = EntityState.Modified;

            await _dbcontext.SaveChangesAsync(ContestlationToken);

            return Unit.Value;
        }
    }
}