using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Reporting.Queries.GetRetailersReport
{
    public class GetRetailersReportQuery : IRequest<RetailersReportDto>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetRetailersReportQueryHandler : IRequestHandler<GetRetailersReportQuery, RetailersReportDto>,
        IApplicationRequestHandler<GetRetailersReportQuery, RetailersReportDto>
    {
        private readonly IApplicationDbContext _context;

        public GetRetailersReportQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RetailersReportDto> Handle(GetRetailersReportQuery request,
            CancellationToken cancellationToken)
        {
            if (request.FromDate == null)
                request.FromDate = DateTime.Now.AddMonths(-3);
            if (request.ToDate == null)
                request.ToDate = DateTime.Now;

            int retailersRegistered = _context.Set<Retailer>().Where(t => t.Created >= request.FromDate && t.Created <= request.ToDate).Count();
            int retailersActive = _context.Set<Retailer>().Where(t => t.Created >= request.FromDate && t.Created <= request.ToDate && !t.IsDeactivated).Count();
            //int retailersActive =  (from retailer in _context.Set<Retailer>()
            //                       join user in _context.Set<User>() on retailer.UserId equals user.Id
            //                       where(!user.IsDeactivated )
            //                       select retailer).Count();  // To do // add user to context
            int Ratio = 0;
            if (retailersActive != 0 && retailersRegistered != 0)
                Ratio = (retailersActive / retailersRegistered) * 100;

            return new RetailersReportDto()
            {
                CountActiveRetailers = retailersActive,
                CountRegisteredRetailers = retailersRegistered,
                RatioActiveRegistered = Ratio
            };
        }


    }
}