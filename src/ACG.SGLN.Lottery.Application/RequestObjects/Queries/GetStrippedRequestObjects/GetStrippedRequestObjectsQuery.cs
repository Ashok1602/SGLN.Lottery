
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
    public class GetStrippedRequestObjectsQuery : IRequest<List<IdValueDto<Guid>>>
    {
        public Guid RequestCategoryId { get; set; }
        public bool? IsPublished { get; set; }
    }

    public class GetAllRequestObjectsQueryHandler : IRequestHandler<GetStrippedRequestObjectsQuery, List<IdValueDto<Guid>>>,
        IApplicationRequestHandler<GetStrippedRequestObjectsQuery, List<IdValueDto<Guid>>>
    {
        private readonly IApplicationDbContext _context;

        public GetAllRequestObjectsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public virtual async Task<List<IdValueDto<Guid>>> Handle(GetStrippedRequestObjectsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Set<RequestObject>()
                .OrderBy(t => t.Title)
                .Where(rq => rq.RequestCategoryId == request.RequestCategoryId && (request.IsPublished.HasValue ? rq.IsDeactivated == false : true))
                .Select(e => new IdValueDto<Guid>
                {
                    Id = e.Id,
                    Value = e.Title
                })
                .ToListAsync();
        }
    }
}
