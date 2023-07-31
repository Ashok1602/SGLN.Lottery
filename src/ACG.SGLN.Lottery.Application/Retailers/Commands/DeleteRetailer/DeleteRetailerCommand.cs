using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class DeleteRetailerCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteRetailerCommandHandler : IRequestHandler<DeleteRetailerCommand, Unit>,
        IApplicationRequestHandler<DeleteRetailerCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public DeleteRetailerCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteRetailerCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<Retailer>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(Retailer), request.Id);

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
