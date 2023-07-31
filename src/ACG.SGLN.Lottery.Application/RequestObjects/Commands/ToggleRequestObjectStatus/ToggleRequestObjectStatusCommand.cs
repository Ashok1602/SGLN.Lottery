using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Commands.ToggleRequestObjectStatus
{
    public class ToggleRequestObjectStatusCommand : IRequest<Unit>
    {
        public bool IsActive { get; set; }
        public Guid Id { get; set; }

    }

    public class ToggleRequestObjectStatusCommandHandler : IRequestHandler<ToggleRequestObjectStatusCommand, Unit>,
        IApplicationRequestHandler<ToggleRequestObjectStatusCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;

        public ToggleRequestObjectStatusCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(ToggleRequestObjectStatusCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<RequestObject>()
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
