
using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RefData.Commands
{
    public class UpdateCityCommand : UpdateCommand<City, int>
    {
    }

    public class UpdateCityCommandHandler : UpdateCommandHandler<City, int>,
        IApplicationRequestHandler<UpdateCityCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public UpdateCityCommandHandler(IApplicationDbContext dbContext) :
            base(dbContext, null)
        {
            _dbContext = dbContext;
        }

        public override async Task<Unit> Handle(UpdateCommand<City, int> request, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Set<City>().FindAsync(request.Id);

            if (entity == null)
                throw new NotFoundException(nameof(City), request.Id);

            entity.Title = request.Data.Title;

            _dbContext.Entry(entity).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
