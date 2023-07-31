using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Retailers.Queries.GetRetailers;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Retailers.Queries
{
    public class RetailerSearchSpecification : BaseSpecification<Retailer>
    {
        public RetailerSearchSpecification(GetRetailersQuery request)
        {
            if (request.Criterea.IsNotified.HasValue)
                AddCriteria(s => s.IsNotified == request.Criterea.IsNotified.Value);

            if (!string.IsNullOrEmpty(request.Criterea.FirstName))
                AddCriteria(s => s.FirstName.Contains(request.Criterea.FirstName));

            if (!string.IsNullOrEmpty(request.Criterea.LastName))
                AddCriteria(s => s.LastName.Contains(request.Criterea.LastName));

            if (!string.IsNullOrEmpty(request.Criterea.Phone))
                AddCriteria(s => s.Phone.Contains(request.Criterea.Phone));

        }
    }
}