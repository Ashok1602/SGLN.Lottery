using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Options;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Invoices.Queries.GetLoyaltyPoints
{
    public class GetLoyaltyPointsQuery : IRequest<LoyaltyPointsDto>
    {
    }

    public class GetLoyaltyPointsQueryHandler : IRequestHandler<GetLoyaltyPointsQuery, LoyaltyPointsDto>,
        IApplicationRequestHandler<GetLoyaltyPointsQuery, LoyaltyPointsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly InvoiceOptions _InvoiceOptions;


        public GetLoyaltyPointsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IOptions<InvoiceOptions> invoiceOptions)
        {
            _context = context;
            _currentUserService = currentUserService;
            _InvoiceOptions = invoiceOptions.Value;
        }

        public async Task<LoyaltyPointsDto> Handle(GetLoyaltyPointsQuery request,
            CancellationToken cancellationToken)
        {
            var retailer = _context.Set<Retailer>().Where(r => r.UserId == _currentUserService.UserId).FirstOrDefault();
            if (retailer == null)
                throw new NotFoundException(nameof(Retailer), _currentUserService.UserId);


            var invoices = _context.Set<Invoice>().Where(r => r.RetailerId == retailer.Id).ToList();
            if (invoices == null || invoices.Count == 0)
                throw new System.InvalidOperationException("Aucune facture trouvée !");

            double amountInvoices = invoices.Sum(i => i.Amount);
            int loyaltyPoints = Convert.ToInt32(amountInvoices / _InvoiceOptions.LoyalityPointsBase);

            return new LoyaltyPointsDto()
            {
                CountInvoices = invoices.Count(),
                AmountInvoices = amountInvoices,
                LoyaltyPoints = loyaltyPoints
            };
        }


    }
}