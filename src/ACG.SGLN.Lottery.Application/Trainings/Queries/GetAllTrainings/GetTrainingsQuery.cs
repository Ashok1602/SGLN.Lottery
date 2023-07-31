using ACG.SGLN.Lottery.Application.Common.Extensions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Queries.GetAllTrainings
{
    public class GetTrainingsQuery : GetAllQuery<Training, Guid>
    {
        public TrainingCriterea Criterea { get; set; } = new TrainingCriterea();
    }

    public class GetTrainingsQueryHandler : GetAllQueryHandler<Training, Guid>,
        IApplicationRequestHandler<GetTrainingsQuery, PagedResult<Training>>
    {
        private readonly IApplicationDbContext _context;

        public GetTrainingsQueryHandler(IApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<PagedResult<Training>> Handle(GetAllQuery<Training, Guid> Training,
            CancellationToken cancellationToken)
        {
            var TrainingQuery = _context.ApplySpecification
                (new TrainingsSearchSpecification((GetTrainingsQuery)Training));

            return await TrainingQuery
                .OrderByDescending(t => t.Created)
                .GetPaged(Training.Page.GetValueOrDefault(1),
                    Training.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }
    }
}