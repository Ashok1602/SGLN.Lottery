using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.CreateVideoTraining
{
    public class CreateVideoTrainingCommand : IRequest<Training>
    {
        public VideoTrainingDto Data { get; set; }
    }

    public class CreateVideoTrainingCommandHandler : IRequestHandler<CreateVideoTrainingCommand, Training>,
        IApplicationRequestHandler<CreateVideoTrainingCommand, Training>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public CreateVideoTrainingCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Training> Handle(CreateVideoTrainingCommand request, CancellationToken cancellationToken)
        {
            Training training = _mapper.Map<Training>(request.Data);
            training.Type = Domain.Enums.TrainingType.Video;

            _dbContext.Set<Training>().Add(training);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return training;
        }
    }
}
