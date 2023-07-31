using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.CreateLiveTraining
{
    public class CreateLiveTrainingCommand : IRequest<Training>
    {
        public LiveTrainingDto Data { get; set; }

        public FileUploadDto SupportDocument { get; set; }
    }

    public class CreateLiveTrainingCommandHandler : IRequestHandler<CreateLiveTrainingCommand, Training>,
        IApplicationRequestHandler<CreateLiveTrainingCommand, Training>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public CreateLiveTrainingCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Training> Handle(CreateLiveTrainingCommand request, CancellationToken cancellationToken)
        {
            Training training = _mapper.Map<Training>(request.Data);
            training.Type = Domain.Enums.TrainingType.Live;

            await _dbContext.Set<Training>().AddAsync(training);

            if (request.SupportDocument != null)
                await _dbContext.Set<TrainingDocument>().AddAsync(new TrainingDocument
                {
                    Data = request.SupportDocument.File,
                    Type = request.SupportDocument.Type,
                    Uri = request.SupportDocument.FileName,
                    MimeType = request.SupportDocument.MimeType,
                    Training = training,
                });

            await _dbContext.SaveChangesAsync(cancellationToken);

            return training;
        }
    }
}
