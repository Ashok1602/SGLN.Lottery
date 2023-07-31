using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;


namespace ACG.SGLN.Lottery.Application.Reporting.Queries.GetRequestsReport
{
    public class GetRequestsReportQuery : IRequest<byte[]>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public RequestsReportCriterea Criterea { get; set; } = new RequestsReportCriterea();
        public DocumentFormat Format { get; set; }
    }

    public class GetRequestsReportQueryHandler : IRequestHandler<GetRequestsReportQuery, byte[]>,
        IApplicationRequestHandler<GetRequestsReportQuery, byte[]>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPdfPrintService _pdfPrintService;
        private readonly IExcelPrintService _excelPrintService;
        public GetRequestsReportQueryHandler(IPdfPrintService pdfPrintService, IApplicationDbContext context, IExcelPrintService excelPrintService)
        {
            _context = context;
            _pdfPrintService = pdfPrintService;
            _excelPrintService = excelPrintService;
        }

        public async Task<byte[]> Handle(GetRequestsReportQuery request, CancellationToken cancellationToken)
        {
            if (request.FromDate == null)
                request.FromDate = DateTime.Now.AddMonths(-3);
            if (request.ToDate == null)
                request.ToDate = DateTime.Now;

            List<Request> data = await _context.ApplySpecification
                    (new RequestsReportSearchSpecification(request))
                    .OrderByDescending(vp => vp.Created)
                    .ToListAsync();

            List<RequestsReportDto> dataToTreat = new List<RequestsReportDto>();

            if (data != null && data.Count > 0)
                dataToTreat = GetReportItem(request, data);

            if (request.Format == DocumentFormat.Pdf)
                return await _pdfPrintService.GeneratePdf<List<RequestsReportDto>>(TemplatesNames.PDFs.Requests, dataToTreat, true);
            else
                return await _excelPrintService.GenerateExcel<RequestsReportDto>(dataToTreat, new List<string> {
                                "Détaillant","Nature","Catégorie","Object","Total"
                }, "Rapport du nombre total de demandes");
        }

        private static List<RequestsReportDto> GetReportItem(GetRequestsReportQuery request, List<Request> data)
        {
            List<RequestsReportDto> dataToReturn = new List<RequestsReportDto>();

            if (request.Criterea.RetailerId.HasValue && data.Any(i => i.RetailerId == request.Criterea.RetailerId))
            {
                RequestsReportDto requestreport = new RequestsReportDto();
                requestreport.Retailer = data.FirstOrDefault().Retailer.FirstName + " " + data.FirstOrDefault().Retailer.LastName;
                requestreport = GetDTO(requestreport, request, data, data.Count());
                dataToReturn.Add(requestreport);
            }
            else
            {
                foreach (var req in data.GroupBy(i => i.RetailerId).ToList())
                {
                    RequestsReportDto requestreport = new RequestsReportDto();
                    requestreport.Retailer = data.FirstOrDefault(i => i.RetailerId == req.Key).Retailer.FirstName + " " + data.FirstOrDefault(i => i.RetailerId == req.Key).Retailer.LastName;
                    requestreport = GetDTO(requestreport, request, data, req.Count());
                    dataToReturn.Add(requestreport);
                }
            }
            return dataToReturn;
        }

        private static RequestsReportDto GetDTO(RequestsReportDto requestreport, GetRequestsReportQuery request, List<Request> data, int CountRequests)
        {
            if (request.Criterea.RequestObjectId.HasValue && data.Any(i => i.RequestObject.Contains(request.Criterea.RequestObjectId.Value.ToString())))
                requestreport.CountByObject = CountRequests;
            else if (request.Criterea.RequestCategoryId.HasValue && data.Any(i => i.RequestCategoryId == request.Criterea.RequestCategoryId))
                requestreport.CountByCaytegory = CountRequests;
            else if (request.Criterea.Nature.HasValue && data.Any(i => i.RequestNature == request.Criterea.Nature))
                requestreport.CountByNature = CountRequests;
            else
                requestreport.CountByRetailer = CountRequests;

            return requestreport;
        }
    }
}