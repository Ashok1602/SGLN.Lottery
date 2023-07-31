
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.RequestObjects.Queries.GetRequestObjectsValidity
{
    public class GetRequestObjectsValidityQuery : IRequest<bool>
    {
        public DateTime LastUpdated { get; set; }
    }

    public class GetRequestObjectsValidityQueryHandler : IRequestHandler<GetRequestObjectsValidityQuery, bool>,
        IApplicationRequestHandler<GetRequestObjectsValidityQuery, bool>
    {
        private readonly IApplicationDbContext _context;

        public GetRequestObjectsValidityQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(GetRequestObjectsValidityQuery request, CancellationToken cancellationToken)
        {
            bool invalid = await _context.Set<RequestObject>()
                .AnyAsync(rq => rq.Created > request.LastUpdated || rq.LastModified > request.LastUpdated);
            return !invalid;
        }
    }
}
