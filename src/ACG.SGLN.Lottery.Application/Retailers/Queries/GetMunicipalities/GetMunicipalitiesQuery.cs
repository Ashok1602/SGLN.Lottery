
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Queries.GetMunicipalities
{
    public class GetMunicipalitiesQuery : IRequest<List<string>>
    {
    }

    public class GetAllRetailersQueryHandler : IRequestHandler<GetMunicipalitiesQuery, List<string>>,
        IApplicationRequestHandler<GetMunicipalitiesQuery, List<string>>
    {
        private readonly IApplicationDbContext _context;

        public GetAllRetailersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<string>> Handle(GetMunicipalitiesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Retailers.Select(r => r.Municipality).Distinct().ToListAsync();
        }
    }
}
