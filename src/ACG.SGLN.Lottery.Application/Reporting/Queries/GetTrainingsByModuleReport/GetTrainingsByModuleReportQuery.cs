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


namespace ACG.SGLN.Lottery.Application.Reporting.Queries.GetTrainingsByModuleReport
{
    public class GetTrainingsByModuleReportQuery : IRequest<byte[]>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public TrainingsByModuleReportCriterea Criterea { get; set; } = new TrainingsByModuleReportCriterea();
        public DocumentFormat Format { get; set; }
    }

    public class GetTrainingsByModuleReportQueryHandler : IRequestHandler<GetTrainingsByModuleReportQuery, byte[]>,
        IApplicationRequestHandler<GetTrainingsByModuleReportQuery, byte[]>
    {
        private readonly IApplicationDbContext _context;
        private readonly IExcelPrintService _excelPrintService;
        private readonly IPdfPrintService _pdfPrintService;
        public GetTrainingsByModuleReportQueryHandler(IPdfPrintService pdfPrintService, IApplicationDbContext context, IExcelPrintService excelPrintService)
        {
            _context = context;
            _excelPrintService = excelPrintService;
            _pdfPrintService = pdfPrintService;
        }

        public async Task<byte[]> Handle(GetTrainingsByModuleReportQuery request, CancellationToken cancellationToken)
        {
            if (request.FromDate == null)
                request.FromDate = DateTime.Now.AddMonths(-3);
            if (request.ToDate == null)
                request.ToDate = DateTime.Now;

            List<TrainingsByModuleReportDto> data = await _context.ApplySpecification
                (new TrainingsByModuleReportSearchSpecification(request))
                .OrderByDescending(vp => vp.Created)
                .Select(vp => GetReportItem(vp))
                .ToListAsync();

            if (request.Format == DocumentFormat.Pdf)
                return await _pdfPrintService.GeneratePdf<List<TrainingsByModuleReportDto>>(TemplatesNames.PDFs.TrainingsByModule, data, true);
            else
                return await _excelPrintService.GenerateExcel<TrainingsByModuleReportDto>(data, new List<string> {
                                "Civilité","Prénom","Nom","Ville","Téléphone","Formation","Module","Date début formation","Date fin formation","Nombre d'heures","Résultat"
                }, "Rapport formation par module");
        }

        private static TrainingsByModuleReportDto GetReportItem(RetailerTraining rt)
        {
            var TrainingDate = rt.Statuses.Find(vs => vs.StatusType == TrainingStatusType.InProgress)?.Created;
            var TestDate = rt.Statuses.Find(vs => vs.StatusType == TrainingStatusType.TestCompleted)?.Created;
            var CompleteCourseDate = rt.Statuses.Find(vs => vs.StatusType == TrainingStatusType.CourseFinished)?.Created;
            int? CompleteDelay = null;

            if (TestDate != null)
                try { CompleteDelay = (int)((TestDate - TrainingDate).Value.TotalHours); } catch (Exception) { }
            else if (CompleteCourseDate != null)
                try { CompleteDelay = (int)((CompleteCourseDate - TrainingDate).Value.TotalHours); } catch (Exception) { }
            else
                CompleteDelay = 0;

            return new TrainingsByModuleReportDto
            {
                Civility = rt.Retailer.Civility,
                FirstName = rt.Retailer.FirstName,
                LastName = rt.Retailer.LastName,
                City = rt.Retailer.City,
                Phone = rt.Retailer.Phone,
                Training = rt.Training.Title,
                Module = rt.Training.Module.Title,
                TrainingDate = TrainingDate?.ToString("dd/MM/yyyy HH:mm"),
                TestDate = TestDate?.ToString("dd/MM/yyyy HH:mm"),
                CompleteDelay = CompleteDelay,
                ScoreRate = rt.ScoreRate
            };
        }
    }
}