using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Trainings.Commands.GenerateCertificate;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using ACG.SGLN.Lottery.Domain.Options;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using InvalidOperationException = ACG.SGLN.Lottery.Application.Common.Exceptions.InvalidOperationException;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.CompleteTraining
{
    public class CompleteTrainingCommand : IRequest<CompleteTrainingVm>
    {
        public Guid TrainingId { get; set; }
        public List<Guid> SelectedOptionIDs { get; set; }
    }

    public class CompleteTrainingCommandHandler : IRequestHandler<CompleteTrainingCommand, CompleteTrainingVm>,
        IApplicationRequestHandler<CompleteTrainingCommand, CompleteTrainingVm>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMediator _mediator;
        private readonly TrainingOptions _trainingOptions;


        public CompleteTrainingCommandHandler(IApplicationDbContext dbcontext, ICurrentUserService currentUserService, IMediator mediator, IOptions<TrainingOptions> trainingOptions)
        {
            _dbcontext = dbcontext;
            _mediator = mediator;
            _currentUserService = currentUserService;
            _trainingOptions = trainingOptions.Value;
        }

        public async Task<CompleteTrainingVm> Handle(CompleteTrainingCommand request,
            CancellationToken cancellationToken)
        {
            Training entity = await _dbcontext.Trainings
                .Where(r => r.Id == request.TrainingId)
                .Include(t => t.Questions)
                .Include("Questions.Options")
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new NotFoundException(nameof(Training), request.TrainingId);

            if (entity.Questions == null || entity.Questions.Count == 0)
                throw new InvalidOperationException("Impossible de teminer le quizz d'une formation qui n'a pas des questions paramétrés");

            var score = entity.Questions.Count(q => q.Options.Where(o => o.IsCorrect).Any(op => request.SelectedOptionIDs.Contains(op.Id)));

            RetailerTraining retailerTrainingEntity = _dbcontext.RetailerTrainings.Include(t => t.Retailer)
                                    .Where(r => r.Retailer.UserId == _currentUserService.UserId && r.TrainingId == entity.Id)
                                    .FirstOrDefault();

            if (retailerTrainingEntity == null || retailerTrainingEntity.LastStatus != TrainingStatusType.CourseFinished)
                throw new InvalidOperationException("Impossible de terminer ce quizz !");

            retailerTrainingEntity.Score = score;
            retailerTrainingEntity.ScoreRate = ((double)score / entity.Questions.Count) * 100;
            retailerTrainingEntity.LastStatus = TrainingStatusType.TestCompleted;
            _dbcontext.Set<RetailerTrainingStatus>().Add(new RetailerTrainingStatus
            {
                RetailerTrainingId = retailerTrainingEntity.Id,
                StatusType = TrainingStatusType.TestCompleted
            });

            _dbcontext.Entry(retailerTrainingEntity).State = EntityState.Modified;
            await _dbcontext.SaveChangesAsync(cancellationToken);

            if (retailerTrainingEntity.ScoreRate >= _trainingOptions.ValidationScoreRate)
                return await GenerateCertificateCommand(retailerTrainingEntity, cancellationToken);
            else
                return new CompleteTrainingVm { Id = null, Type = null, DocumentMimeType = null, DocumentTitle = null, DocumentUri = null, ScoreRate = retailerTrainingEntity.ScoreRate.Value };
        }

        private async Task<CompleteTrainingVm> GenerateCertificateCommand(RetailerTraining retailerTraining, CancellationToken cancellationToken)
        {
            byte[] data = await _mediator.Send(new GenerateCertificateCommand()
            {
                Data = new CertificateTrainingDto()
                {
                    FirstName = retailerTraining.Retailer.FirstName,
                    LastName = retailerTraining.Retailer.LastName,
                    RetailerCode = retailerTraining.Retailer.InternalRetailerCode,
                    Date = DateTime.Today.Date.ToShortDateString(),
                    Adresse = !string.IsNullOrEmpty(retailerTraining.Retailer.Address) ? retailerTraining.Retailer.Address : retailerTraining.Retailer.City,
                }
            }); ;


            RetailerDocument document = new RetailerDocument()
            {
                Data = data,
                Type = DocumentType.TrainingCertificate,
                Spec = DocumentSpec.AutoGenerated,
                MimeType = "application/pdf",
                Retailer = retailerTraining.Retailer,
                IsGenerated = true,
                Uri = "SGLNCertificate" + retailerTraining.Retailer.FirstName + retailerTraining.Retailer.LastName + ".pdf",
                Title = "SGLNCertificate" + retailerTraining.Retailer.FirstName + retailerTraining.Retailer.LastName + ".pdf"
            };

            await _dbcontext.Set<RetailerDocument>().AddAsync(document);
            await _dbcontext.SaveChangesAsync(cancellationToken);

            return new CompleteTrainingVm() { Id = document.Id, Type = document.Type, DocumentMimeType = document.MimeType, DocumentTitle = document.Title, DocumentUri = document.Uri, ScoreRate = retailerTraining.ScoreRate.Value };
        }
    }
}