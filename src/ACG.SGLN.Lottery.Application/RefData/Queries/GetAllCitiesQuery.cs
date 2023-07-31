using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RefData.Queries
{
    [AnonymousAccess]
    public class GetAllCitiesQuery : IRequest<List<IdValueDto<int>>>
    {
    }

    public class GetAllCitiesQueryHandler : IRequestHandler<GetAllCitiesQuery, List<IdValueDto<int>>>,
        IApplicationRequestHandler<GetAllCitiesQuery, List<IdValueDto<int>>>
    {
        private readonly IApplicationDbContext _context;

        public GetAllCitiesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<IdValueDto<int>>> Handle(GetAllCitiesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Set<City>()
                .OrderBy(t => t.Title)
                .Select(e => new IdValueDto<int>
                {
                    Id = e.Id,
                    Value = e.Title
                })
                .ToListAsync();
        }
    }
}
