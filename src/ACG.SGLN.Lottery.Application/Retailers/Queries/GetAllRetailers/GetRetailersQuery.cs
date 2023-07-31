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

namespace ACG.SGLN.Lottery.Application.Retailers.Queries.GetRetailers
{
    public class GetRetailersQuery : GetAllQuery<Retailer, Guid>
    {
        public RetailerCriterea Criterea { get; set; } = new RetailerCriterea();
    }

    public class GetRetailersQueryHandler : GetAllQueryHandler<Retailer, Guid>,
        IApplicationRequestHandler<GetRetailersQuery, PagedResult<Retailer>>
    {
        private readonly IApplicationDbContext _context;

        public GetRetailersQueryHandler(IApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<PagedResult<Retailer>> Handle(GetAllQuery<Retailer, Guid> request,
            CancellationToken cancellationToken)
        {
            var retailerQuery = _context.ApplySpecification
                (new RetailerSearchSpecification((GetRetailersQuery)request));

            return await retailerQuery
                .OrderByDescending(t => t.Created)
                .GetPaged(request.Page.GetValueOrDefault(1),
                    request.Size.GetValueOrDefault(CoreConstants.DefaultPageSize));
        }
    }
}