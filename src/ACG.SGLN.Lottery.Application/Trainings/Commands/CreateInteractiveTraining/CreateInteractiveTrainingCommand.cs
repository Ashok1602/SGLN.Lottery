using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.CreateTraining
{
    public class CreateInteractiveTrainingCommand : IRequest<Training>
    {
        public InteractiveTrainingDto Data { get; set; }
    }

    public class CreateInteractiveTrainingCommandHandler : IRequestHandler<CreateInteractiveTrainingCommand, Training>,
        IApplicationRequestHandler<CreateInteractiveTrainingCommand, Training>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public CreateInteractiveTrainingCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Training> Handle(CreateInteractiveTrainingCommand request, CancellationToken cancellationToken)
        {
            Training training = _mapper.Map<Training>(request.Data);
            training.Type = Domain.Enums.TrainingType.Interactive;

            var questions = request.Data.CourseQuestions.Select(q => new TrainingQuestion
            {
                Label = q.Label,
                Options = q.Options.Select(o => new TrainingQuestionOption
                {
                    Label = o,
                    IsCorrect = q.Options.IndexOf(o) == q.CorrectOptionIndex
                }).ToList(),
            }).ToList();

            training.Questions = questions;

            var slides = request.Data.CourseSlides.OrderByDescending(c => c.Order).Select((s, i) => new TrainingDocument
            {
                Uri = $"Slide{i}",
                Type = Domain.Enums.DocumentType.TrainingCourseSlide,
                MimeType = "image/png",
                Body = s.Body,
                Data = Convert.FromBase64String(s.Image),
            }).ToList();

            training.Documents = slides;

            _dbContext.Set<Training>().Add(training);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return training;
        }
    }
}
