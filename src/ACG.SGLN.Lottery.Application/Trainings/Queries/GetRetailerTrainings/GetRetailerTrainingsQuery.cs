using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Queries.GetAllTrainings
{
    public class GetRetailerTrainingsQuery : IRequest<List<TrainingVm>>
    {
        public RetailerTrainingCriterea Criterea { get; set; } = new RetailerTrainingCriterea();
        public int? Page { get; set; } = 1;
        public int? Size { get; set; } = 25;
        public bool? IsPublished { get; set; }
    }

    public class GetRetailerTrainingsQueryHandler : IRequestHandler<GetRetailerTrainingsQuery, List<TrainingVm>>,
        IApplicationRequestHandler<GetRetailerTrainingsQuery, List<TrainingVm>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetRetailerTrainingsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<List<TrainingVm>> Handle(GetRetailerTrainingsQuery request,
            CancellationToken cancellationToken)
        {
            var retailerId = _context.Set<Retailer>().Where(r => r.UserId == _currentUserService.UserId).FirstOrDefault().Id; //test

            var TrainingQuery = _context.ApplySpecification
                (new RetailerTrainingsSearchSpecification(request));

            if (!string.IsNullOrEmpty(request.Criterea.Filter))
                TrainingQuery = TrainingQuery.Where(r => r.Title.Contains(request.Criterea.Filter));

            return TrainingQuery.ToList()
                .Select(t => GetTrainingItem(t, retailerId))
                .ToList();

        }

        private static TrainingVm GetTrainingItem(Training a, Guid retailerId)
        {
            TrainingVm row = new TrainingVm
            {
                Id = a.Id,
                CourseURI = a.CourseURI,
                Description = a.Description,
                EndDate = a.EndDate,
                StartDate = a.StartDate,
                Title = a.Title,
                Type = a.Type,
                Created = a.Created
            };

            if (a.RetailerTrainings != null)
            {
                var retailerTrainings = a.RetailerTrainings.Where(rt => rt.RetailerId == retailerId).FirstOrDefault();

                row.LastStatus = retailerTrainings?.LastStatus;
                row.Score = retailerTrainings?.Score;
                row.ScoreRate = retailerTrainings?.ScoreRate;
                if (a.Type == TrainingType.Interactive && row.ScoreRate >= 50)
                {
                    var docId = retailerTrainings.Retailer.Documents?.Where(d => d.Type == DocumentType.TrainingCertificate).FirstOrDefault();
                    row.DocumentId = docId?.Id;
                    if (row.DocumentId != null)
                    {
                        row.DocumentType = DocumentType.TrainingCertificate;
                        row.DocumentUri = docId.Uri;
                        row.DocumentTitle = docId.Title;
                        row.DocumentMimeType = docId.MimeType;
                    }
                }
            }
            if (a.Type == TrainingType.Live && row.DocumentId == null)
            {
                var docId = a.Documents?.Where(d => d.Type == DocumentType.TrainingSupportFile).FirstOrDefault();
                row.DocumentId = docId?.Id;
            }

            return row;
        }
    }
}