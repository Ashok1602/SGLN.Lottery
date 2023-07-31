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
    //[AnonymousAccess]
    public class GetCitiesQuery : IRequest<List<string>>
    {
    }

    public class GetCitiesQueryHandler : IRequestHandler<GetCitiesQuery, List<string>>,
        IApplicationRequestHandler<GetCitiesQuery, List<string>>
    {
        private readonly IApplicationDbContext _context;

        public GetCitiesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<string>> Handle(GetCitiesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Set<City>()
                .OrderBy(t => t.Title)
                .Select(e => e.Title)
                .ToListAsync();
        }
    }
}
