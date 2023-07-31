using ACG.SGLN.Lottery.Application.Common.Specifications;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetProcessingTimeRequestsReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetRatioRequestsReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetRequestsReport;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Reporting
{
    public class RequestsReportSearchSpecification : BaseSpecification<Request>
    {
        private GetProcessingTimeRequestsReportQuery request;

        public RequestsReportSearchSpecification(GetRequestsReportQuery request)
        {
            AddInclude(u => u.Retailer);

            AddCriteria(t => t.Created >= request.FromDate);
            AddCriteria(t => t.Created <= request.ToDate);
            if (request.Criterea.Status.HasValue)
                AddCriteria(t => t.LastStatus == request.Criterea.Status);
            if (request.Criterea.RetailerId.HasValue)
                AddCriteria(t => t.RetailerId == request.Criterea.RetailerId);
            if (request.Criterea.Nature.HasValue)
                AddCriteria(t => t.RequestNature == request.Criterea.Nature);
            if (request.Criterea.RequestCategoryId.HasValue)
                AddCriteria(t => t.RequestCategoryId == request.Criterea.RequestCategoryId);
            if (request.Criterea.RequestObjectId.HasValue)
                AddCriteria(t => t.RequestObject.Contains(request.Criterea.RequestObjectId.ToString()));
        }

        public RequestsReportSearchSpecification(GetRatioRequestsReportQuery request)
        {
            AddInclude(u => u.Retailer);

            AddCriteria(t => t.Created >= request.FromDate);
            AddCriteria(t => t.Created <= request.ToDate);
            AddCriteria(t => t.LastStatus == request.Criterea.Status);
            if (request.Criterea.RetailerId.HasValue)
                AddCriteria(t => t.RetailerId == request.Criterea.RetailerId);
            if (request.Criterea.Nature.HasValue)
                AddCriteria(t => t.RequestNature == request.Criterea.Nature);
            if (request.Criterea.RequestCategoryId.HasValue)
                AddCriteria(t => t.RequestCategoryId == request.Criterea.RequestCategoryId);
            if (request.Criterea.RequestObjectId.HasValue)
                AddCriteria(t => t.RequestObject.Contains(request.Criterea.RequestObjectId.ToString()));
        }

        public RequestsReportSearchSpecification(GetProcessingTimeRequestsReportQuery request)
        {
            AddInclude(u => u.Retailer);
            AddInclude(u => u.Statuses);

            AddCriteria(t => t.Created >= request.FromDate);
            AddCriteria(t => t.Created <= request.ToDate);
            if (request.Criterea.RetailerId.HasValue)
                AddCriteria(t => t.RetailerId == request.Criterea.RetailerId);
            if (request.Criterea.Nature.HasValue)
                AddCriteria(t => t.RequestNature == request.Criterea.Nature);
            if (request.Criterea.RequestCategoryId.HasValue)
                AddCriteria(t => t.RequestCategoryId == request.Criterea.RequestCategoryId);
            if (request.Criterea.RequestObjectId.HasValue)
                AddCriteria(t => t.RequestObject.Contains(request.Criterea.RequestObjectId.ToString()));
        }
    }
}