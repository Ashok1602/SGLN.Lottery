using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.EditInteractiveTraining
{
    public class EditInteractiveTrainingCommand : IRequest<Training>
    {
        public Guid Id { get; set; }
        public InteractiveTrainingDto Data { get; set; }
    }

    public class EditInteractiveTrainingCommandHandler : IRequestHandler<EditInteractiveTrainingCommand, Training>,
        IApplicationRequestHandler<EditInteractiveTrainingCommand, Training>
    {
        private readonly IApplicationDbContext _dbContext;

        public EditInteractiveTrainingCommandHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Training> Handle(EditInteractiveTrainingCommand request, CancellationToken cancellationToken)
        {
            Training training = await _dbContext.Trainings
                .Where(r => r.Id == request.Id)
                .Include(t => t.Documents)
                .Include(t => t.Questions)
                .FirstOrDefaultAsync();

            if (training == null)
                throw new NotFoundException(nameof(Training), request.Id);

            if (!string.IsNullOrEmpty(request.Data.Title))
                training.Title = request.Data.Title;
            if (!string.IsNullOrEmpty(request.Data.Description))
                training.Description = request.Data.Description;
            if (request.Data.ModuleId != null)
                training.ModuleId = request.Data.ModuleId;

            foreach (var entity in training.Questions)
            {
                entity.IsDeleted = true;
                _dbContext.Entry(entity).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            _dbContext.Entry(training).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync(cancellationToken);

            //foreach (var entity in training.Documents)
            //{
            //    entity.IsDeleted = true;
            //    _dbContext.Entry(entity).State = EntityState.Modified;
            //}
            if (request.Data.CourseQuestions != null && request.Data.CourseQuestions.Count > 0)
            {
                var questions = request.Data.CourseQuestions.Select(q => new TrainingQuestion
                {
                    Label = q.Label,
                    Options = q.Options.Select(o => new TrainingQuestionOption
                    {
                        Label = o,
                        IsCorrect = q.Options.IndexOf(o) == q.CorrectOptionIndex
                    }).ToList(),
                }).ToList();

                foreach (var entity in questions)
                {
                    entity.TrainingId = training.Id;
                    _dbContext.Set<TrainingQuestion>().Add(new TrainingQuestion
                    {
                        Label = entity.Label,
                        TrainingId = training.Id,
                        Options = entity.Options
                    });
                    await _dbContext.SaveChangesAsync(cancellationToken);
                }
                training.Questions = questions;

            }
            if (request.Data.CourseSlides != null && request.Data.CourseSlides.Count > 0)
            {
                var slides = request.Data.CourseSlides.OrderByDescending(c => c.Order).Select((s, i) => new TrainingDocument
                {
                    Uri = $"Slide{i}",
                    Type = Domain.Enums.DocumentType.TrainingCourseSlide,
                    MimeType = "image/png",
                    Body = s.Body,
                    Data = !string.IsNullOrEmpty(s.Image) ? Convert.FromBase64String(s.Image) : null,
                }).ToList();

                training.Documents = slides;
            }



            return training;
        }
    }
}
