
using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RefData.Commands
{
    public class CreateCityCommand : CreateCommand<City, int>
    {
    }

    public class CreateCityCommandHandler : CreateCommandHandler<City, int>,
        IApplicationRequestHandler<CreateCityCommand, City>
    {
        private readonly IApplicationDbContext _dbContext;

        public CreateCityCommandHandler(IApplicationDbContext dbContext) :
            base(dbContext, null)
        {
            _dbContext = dbContext;
        }

        public override async Task<City> Handle(CreateCommand<City, int> request, CancellationToken cancellationToken)
        {
            _dbContext.Set<City>().Add(request.Data);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return request.Data;
        }
    }
}
