using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RefData.Commands
{
    public class DeleteCityCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class DeleteCityCommandHandler : IRequestHandler<DeleteCityCommand, Unit>,
        IApplicationRequestHandler<DeleteCityCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public DeleteCityCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteCityCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<City>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(City), request.Id);

            entity.IsDeleted = true;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
