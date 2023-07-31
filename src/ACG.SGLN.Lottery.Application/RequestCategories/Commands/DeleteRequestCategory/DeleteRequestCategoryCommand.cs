using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestCategorys.Commands.DeleteRequestCategory
{
    public class DeleteRequestCategoryCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    public class DeleteRequestCategoryCommandHandler : IRequestHandler<DeleteRequestCategoryCommand, Unit>,
        IApplicationRequestHandler<DeleteRequestCategoryCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public DeleteRequestCategoryCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteRequestCategoryCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<RequestCategory>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(RequestCategory), request.Id);

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
