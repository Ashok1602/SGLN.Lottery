using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.ExcellencePrograms.Queries.GetInvoices;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Invoices.Queries
{
    public class InvoicesSearchSpecification : BaseSpecification<Invoice>
    {
        public InvoicesSearchSpecification(GetInvoicesByDateQuery request)
        {
            if (request.Criterea.StartDate.HasValue)
                AddCriteria(s => s.Created.Date >= request.Criterea.StartDate.Value.Date);
            if (request.Criterea.EndDate.HasValue)
                AddCriteria(s => s.Created.Date <= request.Criterea.EndDate.Value.Date);
            if (request.Criterea.MinAmount != 0)
                AddCriteria(t => t.Amount >= request.Criterea.MinAmount);
            if (request.Criterea.MaxAmount != 0)
                AddCriteria(t => t.Amount <= request.Criterea.MaxAmount);
            if (request.Criterea.RetailerId.HasValue)
                AddCriteria(t => t.RetailerId == request.Criterea.RetailerId);
            AddInclude(u => u.Retailer);
        }
    }
}