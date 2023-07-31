using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.TrainingModules.Commands.CreateTrainingModule
{
    public class CreateTrainingModuleCommand : IRequest<Unit>
    {
        public string Title { get; set; }
    }

    public class CreateTrainingModuleCommandHandler : IRequestHandler<CreateTrainingModuleCommand, Unit>,
        IApplicationRequestHandler<CreateTrainingModuleCommand, Unit>
    {
        private readonly IApplicationDbContext _dbContext;

        public CreateTrainingModuleCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(CreateTrainingModuleCommand request, CancellationToken cancellationToken)
        {

            TrainingModule requestObjEntity = new TrainingModule() { Title = request.Title };

            _dbContext.Set<TrainingModule>().Add(requestObjEntity);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
