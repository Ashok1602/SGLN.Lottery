using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Invoices;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetInvoices
{
    public class GetInvoicesByDateQuery : IRequest<List<InvoiceDto>>
    {
        public InvoiceCriterea Criterea { get; set; } = new InvoiceCriterea();
    }

    public class GetInvoicesByDateQueryHandler : IRequestHandler<GetInvoicesByDateQuery, List<InvoiceDto>>,
        IApplicationRequestHandler<GetInvoicesByDateQuery, List<InvoiceDto>>
    {
        //private readonly IApplicationDbContext _context;
        //private readonly ICurrentUserService _currentUserService;

        //public GetInvoicesByDateQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
        //{
        //    _context = context;
        //    _currentUserService = currentUserService;
        //}

        //public async Task<List<InvoiceDto>> Handle(GetInvoicesByDateQuery request,
        //    CancellationToken cancellationToken)
        //{
        //    if (_currentUserService.RoleNames.Contains(AuthorizationConstants.Roles.Retailers))
        //    {
        //        Retailer retailer = _context.Set<Retailer>()
        //                           .Where(r => r.UserId == _currentUserService.UserId)
        //                           .FirstOrDefault();
        //        if (retailer == null)
        //            throw new InvalidOperationException("L'utilisateur courant n'a pas accès aux factures");
        //        request.Criterea.RetailerId = retailer.Id;
        //    }

        //    List<InvoiceDto> data = await _context.ApplySpecification
        //       (new InvoicesSearchSpecification(request))
        //       .OrderByDescending(vp => vp.Created)
        //       .Select(vp => GetInvoiceItem(vp))
        //       .ToListAsync();

        //    return data;
        //}

        //private static InvoiceDto GetInvoiceItem(Invoice i)
        //{
        //    return new InvoiceDto
        //    {
        //        RetailerId = i.RetailerId,
        //        Reference = i.Reference,
        //        Status = i.Status,
        //        Date = Convert.ToDateTime(i.Date),
        //        Amount = i.Amount
        //    };
        //}

        public GetInvoicesByDateQueryHandler()
        {
        }

        public async Task<List<InvoiceDto>> Handle(GetInvoicesByDateQuery request,
            CancellationToken cancellationToken)
        {
            List<InvoiceDto> InvoiceDtos = new List<InvoiceDto>();
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#hg4264", Amount = 65982.00, Status = "Payée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#j2648h", Amount = 65878.98, Status = "ImPayée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#j65974", Amount = 185226.00, Status = "Payée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#86323", Amount = 325268.50, Status = "ImPayée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#hg4264", Amount = 123256, Status = "Payée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#632836", Amount = 65878.98, Status = "ImPayée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#j65974", Amount = 1252526.00, Status = "Payée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#784", Amount = 325268.50, Status = "ImPayée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#hg4264", Amount = 268687, Status = "Payée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#75", Amount = 65878.98, Status = "ImPayée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#485515", Amount = 624684, Status = "Payée" });
            InvoiceDtos.Add(new InvoiceDto() { Date = DateTime.Now.Date, Reference = "#7587", Amount = 325268.50, Status = "ImPayée" });
            return InvoiceDtos;

        }
    }

}