
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestCategorys.Queries.GetStrippedRequestCategorys
{
    public class GetStrippedRequestCategoriesByNatureQuery : IRequest<List<IdValueDto<Guid>>>
    {
        public RequestNatureType RequestNature { get; set; }
        public bool? IsPublished { get; set; }
    }

    public class GetStrippedRequestCategoriesByNatureQueryHandler : IRequestHandler<GetStrippedRequestCategoriesByNatureQuery, List<IdValueDto<Guid>>>,
        IApplicationRequestHandler<GetStrippedRequestCategoriesByNatureQuery, List<IdValueDto<Guid>>>
    {
        private readonly IApplicationDbContext _context;

        public GetStrippedRequestCategoriesByNatureQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<IdValueDto<Guid>>> Handle(GetStrippedRequestCategoriesByNatureQuery request, CancellationToken cancellationToken)
        {
            return await _context.Set<RequestCategory>()
                .OrderBy(t => t.Title)
                .Where(rq => rq.RequestNature == request.RequestNature && (request.IsPublished.HasValue ? rq.IsDeactivated == false : true))
                .Select(e => new IdValueDto<Guid>
                {
                    Id = e.Id,
                    Value = e.Title
                })
                .ToListAsync();
        }
    }
}
