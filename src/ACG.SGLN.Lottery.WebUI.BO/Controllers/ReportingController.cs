using ACG.SGLN.Lottery.Application.Reporting.Queries;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetIncentivesReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetProcessingTimeRequestsReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetRatioRequestsReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetRequestsReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetRetailersReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetTrainingsByModuleReport;
using ACG.SGLN.Lottery.Application.Reporting.Queries.GetTrainingsByRetailerReport;
using ACG.SGLN.Lottery.Domain.Entities.Criterias;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO.Controllers
{
    /// <summary>
    /// Reporting controller
    /// </summary>
    [Authorize]
    [Route("[controller]")]
    public class ReportingController : Controller
    {
        private IMediator _mediator;

        /// <summary>
        /// 
        /// </summary>
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();


        /// <summary>
        /// Generate Trainings By Module report 
        /// </summary>
        /// <returns></returns>
        [HttpGet("trainingsByModule")]
        public async Task<ActionResult> GenerateTrainingsByModuleReport([FromQuery] TrainingsByModuleReportCriterea TrainingsByModuleReportCriterea, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] DocumentFormat documentFormat)
        {
            return GetDocument(await Mediator.Send(new GetTrainingsByModuleReportQuery() { Criterea = TrainingsByModuleReportCriterea, Format = documentFormat, FromDate = fromDate, ToDate = toDate }), GetMimeType(documentFormat));
        }

        /// <summary>
        /// Generate Trainings By Retailer report 
        /// </summary>
        /// <returns></returns>
        [HttpGet("trainingsByRetailer")]
        public async Task<ActionResult> GenerateTrainingsByRetailerReport([FromQuery] TrainingsByRetailerReportCriterea expertiseReportCriterea, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] DocumentFormat documentFormat)
        {
            return GetDocument(await Mediator.Send(new GetTrainingsByRetailerReportQuery() { Criterea = expertiseReportCriterea, Format = documentFormat, FromDate = fromDate, ToDate = toDate }), GetMimeType(documentFormat));
        }


        /// <summary>
        /// Generate Incentives report 
        /// </summary>
        /// <returns></returns>
        [HttpGet("incentives")]
        public async Task<ActionResult> GenerateIncentivesReport([FromQuery] IncentivesReportCriterea expertiseReportCriterea, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] DocumentFormat documentFormat)
        {
            return GetDocument(await Mediator.Send(new GetIncentivesReportQuery() { Criterea = expertiseReportCriterea, Format = documentFormat, FromDate = fromDate, ToDate = toDate }), GetMimeType(documentFormat));
        }

        /// <summary>
        /// Generate Ratio Requests Report
        /// </summary>
        /// <returns></returns>
        [HttpGet("ratioRequests")]
        public async Task<ActionResult> GenerateRatioRequestsReport([FromQuery] RatioRequestsReportCriterea ratioRequestsReportCriterea, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] DocumentFormat documentFormat)
        {
            return GetDocument(await Mediator.Send(new GetRatioRequestsReportQuery() { Criterea = ratioRequestsReportCriterea, Format = documentFormat, FromDate = fromDate, ToDate = toDate }), GetMimeType(documentFormat));
        }

        /// <summary>
        /// Generate Requests report 
        /// </summary>
        /// <returns></returns>
        [HttpGet("requests")]
        public async Task<ActionResult> GenerateRequestsReport([FromQuery] RequestsReportCriterea requestsReportCriterea, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] DocumentFormat documentFormat)
        {
            return GetDocument(await Mediator.Send(new GetRequestsReportQuery() { Criterea = requestsReportCriterea, Format = documentFormat, FromDate = fromDate, ToDate = toDate }), GetMimeType(documentFormat));
        }

        /// <summary>
        /// Generate Processing Time Requests report 
        /// </summary>
        /// <returns></returns>
        [HttpGet("processingTimeRequests")]
        public async Task<ActionResult> GenerateProcessingTimeRequestsReport([FromQuery] ProcessingTimeRequestsReportCriterea criterea, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] DocumentFormat documentFormat)
        {
            return GetDocument(await Mediator.Send(new GetProcessingTimeRequestsReportQuery() { Criterea = criterea, Format = documentFormat, FromDate = fromDate, ToDate = toDate }), GetMimeType(documentFormat));
        }

        /// <summary>
        /// Get Retailers Report
        /// </summary>
        /// <returns></returns>
        [HttpGet("retailers")]
        public async Task<ActionResult<RetailersReportDto>> GetRetailerReport([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            return await Mediator.Send(new GetRetailersReportQuery { FromDate = fromDate, ToDate = toDate });
        }

        private ActionResult GetDocument(byte[] data, string mimeType)
        {
            if (data != null && data.Length > 0)
            {
                return File(data, mimeType);
            }

            return File("~/placeholder-generic.png", "image/png");
        }

        private string GetMimeType(DocumentFormat documentFormat)
        {
            return documentFormat == DocumentFormat.Pdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
    }
}
