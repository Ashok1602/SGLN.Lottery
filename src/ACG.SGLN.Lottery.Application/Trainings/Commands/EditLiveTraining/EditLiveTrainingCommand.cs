using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.EditLiveTraining
{
    public class EditLiveTrainingCommand : IRequest<Training>
    {
        public Guid Id { get; set; }
        public LiveTrainingDto Data { get; set; }
        public FileUploadDto SupportDocument { get; set; }
    }

    public class EditLiveTrainingCommandHandler : IRequestHandler<EditLiveTrainingCommand, Training>,
        IApplicationRequestHandler<EditLiveTrainingCommand, Training>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public EditLiveTrainingCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Training> Handle(EditLiveTrainingCommand request, CancellationToken cancellationToken)
        {
            Training training = await _dbContext.Set<Training>().FindAsync(request.Id);
            if (training == null)
                throw new NotFoundException(nameof(Training), request.Id);

            if (!string.IsNullOrEmpty(request.Data.CourseURI))
                training.CourseURI = request.Data.CourseURI;

            if (!string.IsNullOrEmpty(request.Data.Title))
                training.Title = request.Data.Title;

            if (request.Data.EndDate.HasValue)
                training.EndDate = request.Data.EndDate;

            if (request.Data.StartDate.HasValue)
                training.StartDate = request.Data.StartDate;

            _dbContext.Entry(training).State = EntityState.Modified;

            if (request.SupportDocument != null)
                await _dbContext.Set<TrainingDocument>().AddAsync(new TrainingDocument
                {
                    Data = request.SupportDocument.File,
                    Type = request.SupportDocument.Type,
                    MimeType = request.SupportDocument.MimeType,
                    Uri = request.SupportDocument.FileName,
                    Training = training,
                });

            await _dbContext.SaveChangesAsync(cancellationToken);

            return training;
        }
    }
}
