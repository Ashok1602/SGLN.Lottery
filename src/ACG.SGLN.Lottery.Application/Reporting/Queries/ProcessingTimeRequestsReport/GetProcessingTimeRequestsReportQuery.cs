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


namespace ACG.SGLN.Lottery.Application.Reporting.Queries.GetProcessingTimeRequestsReport
{
    public class GetProcessingTimeRequestsReportQuery : IRequest<byte[]>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public ProcessingTimeRequestsReportCriterea Criterea { get; set; } = new ProcessingTimeRequestsReportCriterea();
        public DocumentFormat Format { get; set; }
    }

    public class GetProcessingTimeRequestsReportQueryHandler : IRequestHandler<GetProcessingTimeRequestsReportQuery, byte[]>,
        IApplicationRequestHandler<GetProcessingTimeRequestsReportQuery, byte[]>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPdfPrintService _pdfPrintService;
        private readonly IExcelPrintService _excelPrintService;
        public GetProcessingTimeRequestsReportQueryHandler(IPdfPrintService pdfPrintService, IApplicationDbContext context, IExcelPrintService excelPrintService)
        {
            _context = context;
            _pdfPrintService = pdfPrintService;
            _excelPrintService = excelPrintService;
        }

        public async Task<byte[]> Handle(GetProcessingTimeRequestsReportQuery request, CancellationToken cancellationToken)
        {
            if (request.FromDate == null)
                request.FromDate = DateTime.Now.AddMonths(-3);
            if (request.ToDate == null)
                request.ToDate = DateTime.Now;

            List<Request> data = await _context.ApplySpecification
                (new RequestsReportSearchSpecification(request))
                .Where(r => r.LastStatus != RequestStatusType.Submitted && r.LastStatus != RequestStatusType.InProgress)
                .OrderByDescending(vp => vp.Created)
                .ToListAsync();

            List<ProcessingTimeRequestsReportDto> dataToTreat = new List<ProcessingTimeRequestsReportDto>();

            if (data != null && data.Count > 0)
                dataToTreat = GetReportItem(request, data);

            if (request.Format == DocumentFormat.Pdf)
                return await _pdfPrintService.GeneratePdf<List<ProcessingTimeRequestsReportDto>>(TemplatesNames.PDFs.ProcessingTimeRequests, dataToTreat, true);
            else
                return await _excelPrintService.GenerateExcel<ProcessingTimeRequestsReportDto>(dataToTreat, new List<string> {
                                "Détaillant","Nature (j)","Nature (h)","Catégorie (j)","Catégorie (h)","Object (j)","Object (h)","Total (j)","Total (h)"
                }, "Rapport du délai moyen de traitement des demandes");
        }

        private static List<ProcessingTimeRequestsReportDto> GetReportItem(GetProcessingTimeRequestsReportQuery request, List<Request> data)
        {
            List<ProcessingTimeRequestsReportDto> dataToReturn = new List<ProcessingTimeRequestsReportDto>();

            if (request.Criterea.RetailerId.HasValue && data.Any(i => i.RetailerId == request.Criterea.RetailerId))
            {
                ProcessingTimeRequestsReportDto requestreport = new ProcessingTimeRequestsReportDto();
                requestreport.Retailer = data.FirstOrDefault().Retailer.FirstName + " " + data.FirstOrDefault().Retailer.LastName;
                int CountDays = 0;
                int CountHours = 0;
                foreach (var req in data)
                {
                    CountDays += CountDaysBetween(req.Created, req.Statuses.OrderByDescending(s => s.Created).FirstOrDefault().Created);
                    CountHours += CountHoursBetween(req.Created, req.Statuses.OrderByDescending(s => s.Created).FirstOrDefault().Created);
                }
                requestreport = GetDTO(requestreport, request, data, CountDays, CountHours);
                dataToReturn.Add(requestreport);
            }
            else
            {
                foreach (var req in data.GroupBy(i => i.RetailerId).ToList())
                {
                    ProcessingTimeRequestsReportDto requestreport = new ProcessingTimeRequestsReportDto();
                    requestreport.Retailer = data.FirstOrDefault(i => i.RetailerId == req.Key).Retailer.FirstName + " " + data.FirstOrDefault(i => i.RetailerId == req.Key).Retailer.LastName;
                    int CountDays = 0;
                    int CountHours = 0;
                    foreach (var r in req)
                    {
                        CountDays += CountDaysBetween(r.Created, r.Statuses.OrderByDescending(s => s.Created).FirstOrDefault().Created);
                        CountHours += CountHoursBetween(r.Created, r.Statuses.OrderByDescending(s => s.Created).FirstOrDefault().Created);
                    }
                    requestreport = GetDTO(requestreport, request, data, CountDays, CountHours);
                    dataToReturn.Add(requestreport);
                }
            }
            return dataToReturn;
        }

        private static ProcessingTimeRequestsReportDto GetDTO(ProcessingTimeRequestsReportDto requestreport, GetProcessingTimeRequestsReportQuery request, List<Request> data, int CountDays, int CountHours)
        {
            if (request.Criterea.RequestObjectId.HasValue && data.Any(i => i.RequestObject.Contains(request.Criterea.RequestObjectId.Value.ToString())))
            {
                requestreport.ProcessingDaysByObject = CountDays / data.Count;
                requestreport.ProcessingHoursByObject = CountHours / data.Count;
            }
            else if (request.Criterea.RequestCategoryId.HasValue && data.Any(i => i.RequestCategoryId == request.Criterea.RequestCategoryId))
            {
                requestreport.ProcessingDaysByCaytegory = CountDays / data.Count;
                requestreport.ProcessingHoursByCaytegory = CountHours / data.Count;
            }
            else if (request.Criterea.Nature.HasValue && data.Any(i => i.RequestNature == request.Criterea.Nature))
            {
                requestreport.ProcessingDaysByNature = CountDays / data.Count;
                requestreport.ProcessingHoursByNature = CountHours / data.Count;
            }
            else
            {
                requestreport.ProcessingDaysByRetailer = CountDays / data.Count;
                requestreport.ProcessingHoursByRetailer = CountHours / data.Count;
            }

            return requestreport;
        }

        private static int CountDaysBetween(DateTime start, DateTime end)
        {
            int days = end.Subtract(start).Days;
            return Enumerable.Range(0, days)
                             .Select(day => start.AddDays(day))
                             .Count();
        }

        private static int CountHoursBetween(DateTime start, DateTime end)
        {
            int days = end.Subtract(start).Hours;
            return Enumerable.Range(0, days)
                             .Select(day => start.AddHours(day))
                             .Count();
        }
    }
}