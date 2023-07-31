
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetStrippedRequestObjects
{
    public class GetStrippedRequestCategoriesQuery : IRequest<List<IdValueDto<Guid>>>
    {
        public bool? IsPublished { get; set; }
    }

    public class GetStrippedRequestCategoriesQueryHandler : IRequestHandler<GetStrippedRequestCategoriesQuery, List<IdValueDto<Guid>>>,
        IApplicationRequestHandler<GetStrippedRequestCategoriesQuery, List<IdValueDto<Guid>>>
    {
        private readonly IApplicationDbContext _context;

        public GetStrippedRequestCategoriesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<IdValueDto<Guid>>> Handle(GetStrippedRequestCategoriesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Set<RequestCategory>()
                .OrderBy(t => t.Title)
                .Where(rq => request.IsPublished.HasValue ? rq.IsDeactivated == false : true)
                .Select(e => new IdValueDto<Guid>
                {
                    Id = e.Id,
                    Value = e.Title
                })
                .ToListAsync();
        }
    }
}
