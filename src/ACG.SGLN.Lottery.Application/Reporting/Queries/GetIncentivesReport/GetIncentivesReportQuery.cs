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


namespace ACG.SGLN.Lottery.Application.Reporting.Queries.GetIncentivesReport
{
    public class GetIncentivesReportQuery : IRequest<byte[]>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public IncentivesReportCriterea Criterea { get; set; } = new IncentivesReportCriterea();
        public DocumentFormat Format { get; set; }
    }

    public class GetIncentivesReportQueryHandler : IRequestHandler<GetIncentivesReportQuery, byte[]>,
        IApplicationRequestHandler<GetIncentivesReportQuery, byte[]>
    {
        private readonly IApplicationDbContext _context;
        private readonly IPdfPrintService _pdfPrintService;
        private readonly IExcelPrintService _excelPrintService;
        public GetIncentivesReportQueryHandler(IPdfPrintService pdfPrintService, IApplicationDbContext context, IExcelPrintService excelPrintService)
        {
            _context = context;
            _pdfPrintService = pdfPrintService;
            _excelPrintService = excelPrintService;
        }

        public async Task<byte[]> Handle(GetIncentivesReportQuery request, CancellationToken cancellationToken)
        {
            if (request.FromDate == null)
                request.FromDate = DateTime.Now.AddMonths(-3);
            if (request.ToDate == null)
                request.ToDate = DateTime.Now;

            List<IncentivesReportDto> data = await _context.ApplySpecification
                (new IncentivesReportSearchSpecification(request))
                .OrderByDescending(vp => vp.Created)
                .Select(vp => GetReportItem(vp))
                .ToListAsync();

            if (request.Format == DocumentFormat.Pdf)
                return await _pdfPrintService.GeneratePdf<List<IncentivesReportDto>>(TemplatesNames.PDFs.Incentives, data, true);
            else
                return await _excelPrintService.GenerateExcel<IncentivesReportDto>(data, new List<string> {
                                "Nom campagne","Date début","Date fin","Objectif"
                                ,"Réalisé","Pourcentage de réalisation","Reste à réaliser","Bonus"
                }, "Rapport des réalisations des incentives");
        }

        private static IncentivesReportDto GetReportItem(Incentive rt)
        {
            return new IncentivesReportDto
            {
                CompanyIdentifier = rt.Retailer.CompanyIdentifier,
                StartDate = rt.StartDate.ToString("dd/MM/yyyy"),
                EndDate = rt.EndDate.ToString("dd/MM/yyyy"),
                Goal = rt.Goal,
                Achievement = rt.Achievement,
                AchievementRate = (rt.Achievement / rt.Goal) * 100,
                Remains = rt.Goal - rt.Achievement,
                Bonus = rt.Bonus
            };
        }
    }
}