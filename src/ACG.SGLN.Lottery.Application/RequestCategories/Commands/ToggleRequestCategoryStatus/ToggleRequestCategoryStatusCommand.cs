using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestCategorys.Commands.ToggleRequestCategoryStatus
{
    public class ToggleRequestCategoryStatusCommand : IRequest<Unit>
    {
        public bool IsActive { get; set; }
        public Guid Id { get; set; }

    }

    public class ToggleRequestCategoryStatusCommandHandler : IRequestHandler<ToggleRequestCategoryStatusCommand, Unit>,
        IApplicationRequestHandler<ToggleRequestCategoryStatusCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;

        public ToggleRequestCategoryStatusCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ToggleRequestCategoryStatusCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<RequestCategory>()
                    .Where(r => r.Id == request.Id)
                    .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Retailer), _currentUserService.UserId);

            entity.IsDeactivated = !request.IsActive;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
