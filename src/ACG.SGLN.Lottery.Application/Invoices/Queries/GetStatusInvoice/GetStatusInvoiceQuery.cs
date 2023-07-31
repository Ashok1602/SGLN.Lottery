using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Invoices.Queries.GetStatusInvoice
{
    public class GetStatusInvoiceQuery : IRequest<StatusInvoiceDto>
    {
        //public int NmbreMonths = 6;
    }

    public class GetStatusInvoiceQueryHandler : IRequestHandler<GetStatusInvoiceQuery, StatusInvoiceDto>,
        IApplicationRequestHandler<GetStatusInvoiceQuery, StatusInvoiceDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public GetStatusInvoiceQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<StatusInvoiceDto> Handle(GetStatusInvoiceQuery request,
            CancellationToken cancellationToken)
        {
            var retailer = _context.Set<Retailer>().Where(r => r.UserId == _currentUserService.UserId).FirstOrDefault(); //test
            if (retailer == null)
                throw new NotFoundException(nameof(Retailer), _currentUserService.UserId);

            //var minDate = DateTime.Now.AddMonths(-request.NmbreMonths);

            //var invoices = _context.Set<Invoice>().Where(r => r.RetailerId == retailer.Id && r.Date > minDate).ToList(); //test
            //if (invoices == null || invoices.Count == 0)
            //    throw new System.InvalidOperationException("Aucune facture trouvée !");

            //List<MonthlyReportDto> ListMonthlyReport = new List<MonthlyReportDto>();

            //var monthList = invoices
            //    .GroupBy(i => new { i.Date.Year, i.Date.Month })
            //    .Select(g => new {
            //        Year = g.Key.Year,
            //        Month = g.Key.Month,
            //        FullDate = DateTimeFormatInfo.CurrentInfo.GetMonthName(g.Key.Month) + " " + g.Key.Year
            //    });

            //foreach(var date in monthList)
            //{
            //    MonthlyReportDto monthlyReport = new MonthlyReportDto() 
            //    {
            //        Month = date.Month.ToString(),
            //        Year = date.Year.ToString(),
            //        StartDate = new DateTime(date.Year, date.Month, 1),
            //        EndDate = new DateTime(date.Year, date.Month, 1).AddMonths(1).AddDays(-1), 
            //        Total = invoices.Where(i => i.Date.Year == date.Year && i.Date.Month == date.Month).Sum(i => i.Amount), 
            //        Unpaid = invoices.Where(i => i.Date.Year == date.Year && i.Date.Month == date.Month && i.Status == InvoiceStatusType.Unpaid).Sum(i => i.Amount)
            //    };
            //    ListMonthlyReport.Add(monthlyReport);
            //}

            //return new StatusInvoiceDto()
            //{
            //    PaidAmountInvoicesLastSixMonths = invoices.Where(i => i.Status == InvoiceStatusType.Paid).Sum(i=>i.Amount),
            //    UnPaidAmountInvoicesLastSixMonths = invoices.Where(i => i.Status == InvoiceStatusType.Unpaid).Sum(i => i.Amount),
            //    MonthlyReport = ListMonthlyReport
            //};

            return new StatusInvoiceDto()
            {
                PaidAmountInvoicesLastSixMonths = 58264,
                UnPaidAmountInvoicesLastSixMonths = 66287,
                MonthlyReport = new List<MonthlyReportDto>()
            { new MonthlyReportDto() {Month = "Janvier" , Year = "2021" , StartDate  =  new DateTime(2021, 1, 1) , EndDate = new DateTime(2021, 1, 1).AddMonths(1).AddDays(-1) , Total = 36246, Unpaid = 6265 } ,
            new MonthlyReportDto() {Month = "Février" , Year = "2021" , StartDate  =  new DateTime(2021, 2, 1) , EndDate = new DateTime(2021, 2, 1).AddMonths(1).AddDays(-1) , Total = 6885678, Unpaid = 46514 } ,
            new MonthlyReportDto() {Month = "Mars" , Year = "2021" , StartDate  =  new DateTime(2021, 3, 1) , EndDate = new DateTime(2021, 3, 1).AddMonths(1).AddDays(-1) , Total = 15368, Unpaid = 4153 } ,
            new MonthlyReportDto() {Month = "Avril" , Year = "2021" , StartDate  =  new DateTime(2021, 4, 1) , EndDate = new DateTime(2021, 4, 1).AddMonths(1).AddDays(-1) , Total = 183183, Unpaid = 4545 } }
            };
        }


    }
}