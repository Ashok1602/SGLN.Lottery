
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Queries.GetStrippedRetailers
{
    public class GetStrippedRetailersQuery : IRequest<List<IdValueDto<Guid>>>
    {
        public string Filter { get; set; }
    }

    public class GetAllRetailersQueryHandler : IRequestHandler<GetStrippedRetailersQuery, List<IdValueDto<Guid>>>,
        IApplicationRequestHandler<GetStrippedRetailersQuery, List<IdValueDto<Guid>>>
    {
        private readonly IApplicationDbContext _context;

        public GetAllRetailersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<IdValueDto<Guid>>> Handle(GetStrippedRetailersQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Retailers.AsQueryable();

            if (!string.IsNullOrEmpty(request.Filter))
                query = query.Where(r => r.FirstName.Contains(request.Filter) || r.LastName.Contains(request.Filter));

            return await query.Select(e => new IdValueDto<Guid>
            {
                Id = e.Id,
                Value = $"{e.FirstName} {e.LastName}({e.InternalRetailerCode})"
            }).ToListAsync();
        }
    }
}
