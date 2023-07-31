using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Commands.DeleteRequestObject
{
    public class DeleteRequestObjectCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteRequestObjectCommandHandler : IRequestHandler<DeleteRequestObjectCommand, Unit>,
        IApplicationRequestHandler<DeleteRequestObjectCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public DeleteRequestObjectCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteRequestObjectCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<RequestObject>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(RequestObject), request.Id);

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
