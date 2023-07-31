using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Queries.GetTrainingQuestionsById
{
    public class GetTrainingQuestionsByIdQuery : IRequest<List<TrainingQuestion>>
    {
        public Guid Id { get; set; }
    }

    public class GetTrainingQuestionsByIdQueryQueryHandler : IRequestHandler<GetTrainingQuestionsByIdQuery, List<TrainingQuestion>>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IMapper _mapper;

        public GetTrainingQuestionsByIdQueryQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TrainingQuestion>> Handle(GetTrainingQuestionsByIdQuery request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.Set<TrainingQuestion>()
                .Where(r => r.TrainingId == request.Id)
                .Include(r => r.Options)
                .ToListAsync();

            if (entity == null)
                throw new NotFoundException(nameof(TrainingQuestion), request.Id);

            return entity;
        }
    }
}
