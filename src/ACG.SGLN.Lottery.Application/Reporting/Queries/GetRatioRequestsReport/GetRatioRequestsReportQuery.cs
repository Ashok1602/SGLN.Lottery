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


namespace ACG.SGLN.Lottery.Application.Reporting.Queries.GetRatioRequestsReport
{
    public class GetRatioRequestsReportQuery : IRequest<byte[]>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public RatioRequestsReportCriterea Criterea { get; set; } = new RatioRequestsReportCriterea();
        public DocumentFormat Format { get; set; }
    }

    public class GetRatioRequestsReportQueryHandler : IRequestHandler<GetRatioRequestsReportQuery, byte[]>,
        IApplicationRequestHandler<GetRatioRequestsReportQuery, byte[]>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPdfPrintService _pdfPrintService;
        private readonly IExcelPrintService _excelPrintService;
        public GetRatioRequestsReportQueryHandler(IPdfPrintService pdfPrintService, IApplicationDbContext context, IExcelPrintService excelPrintService)
        {
            _context = context;
            _pdfPrintService = pdfPrintService;
            _excelPrintService = excelPrintService;
        }

        public async Task<byte[]> Handle(GetRatioRequestsReportQuery request, CancellationToken cancellationToken)
        {
            if (request.FromDate == null)
                request.FromDate = DateTime.Now.AddMonths(-3);
            if (request.ToDate == null)
                request.ToDate = DateTime.Now;

            List<Request> data = await _context.ApplySpecification
                (new RequestsReportSearchSpecification(request))
                .OrderByDescending(vp => vp.Created)
                .ToListAsync();

            List<RatioRequestsReportDto> dataToTreat = new List<RatioRequestsReportDto>();

            if (data != null && data.Count > 0)
                dataToTreat = GetReportItem(_context, request, data);

            if (request.Format == DocumentFormat.Pdf)
                return await _pdfPrintService.GeneratePdf<List<RatioRequestsReportDto>>(TemplatesNames.PDFs.RatioRequests, dataToTreat, true);
            else
                return await _excelPrintService.GenerateExcel<RatioRequestsReportDto>(dataToTreat, new List<string> {
                                "Détaillant","Nature","Catégorie","Object","Ratio","Pourcentage %"
                }, "Rapport du ratio des demandes");
        }

        private static List<RatioRequestsReportDto> GetReportItem(IApplicationDbContext _context, GetRatioRequestsReportQuery request, List<Request> data)
        {
            List<RatioRequestsReportDto> dataToReturn = new List<RatioRequestsReportDto>();

            if (request.Criterea.RetailerId.HasValue && data.Any(i => i.RetailerId == request.Criterea.RetailerId))
            {
                RatioRequestsReportDto requestreport = new RatioRequestsReportDto();
                requestreport.Retailer = data.FirstOrDefault().Retailer.FirstName + " " + data.FirstOrDefault().Retailer.LastName;
                int CountRequests = _context.Set<Request>().Where(r => r.RetailerId == request.Criterea.RetailerId).Count();
                requestreport = GetDTO(requestreport, request, data, CountRequests, data.Count());
                dataToReturn.Add(requestreport);
            }
            else
            {
                foreach (var req in data.GroupBy(i => i.RetailerId).ToList())
                {
                    RatioRequestsReportDto requestreport = new RatioRequestsReportDto();
                    requestreport.Retailer = data.FirstOrDefault(i => i.RetailerId == req.Key).Retailer.FirstName + " " + data.FirstOrDefault(i => i.RetailerId == req.Key).Retailer.LastName;
                    int CountRequests = _context.Set<Request>().Where(r => r.RetailerId == req.Key).Count();
                    requestreport = GetDTO(requestreport, request, data, CountRequests, req.Count());
                    dataToReturn.Add(requestreport);
                }
            }
            return dataToReturn;
        }

        private static RatioRequestsReportDto GetDTO(RatioRequestsReportDto requestreport, GetRatioRequestsReportQuery request, List<Request> data, int CountRequests, int Count)
        {
            if (request.Criterea.RequestObjectId.HasValue && data.Any(i => i.RequestObject.Contains(request.Criterea.RequestObjectId.Value.ToString())))
                requestreport.RatioByObject = Count / CountRequests;
            else if (request.Criterea.RequestCategoryId.HasValue && data.Any(i => i.RequestCategoryId == request.Criterea.RequestCategoryId))
                requestreport.RatioByCaytegory = Count / CountRequests;
            else if (request.Criterea.Nature.HasValue && data.Any(i => i.RequestNature == request.Criterea.Nature))
                requestreport.RatioByNature = Count / CountRequests;
            else
                requestreport.RatioByRetailer = Count / CountRequests;
            requestreport.Percentage = (Count / CountRequests) * 100;

            return requestreport;
        }
    }
}