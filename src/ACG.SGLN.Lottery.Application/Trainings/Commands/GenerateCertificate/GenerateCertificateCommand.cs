using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Trainings.Commands.GenerateCertificate
{
    public class CertificateTrainingDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Date { get; set; }
        public string Adresse { get; set; }
        public string RetailerCode { get; set; }

    }

    public class GenerateCertificateCommand : IRequest<byte[]>
    {
        public CertificateTrainingDto Data { get; set; }
    }

    public class GenerateCertificateCommandHandler : IRequestHandler<GenerateCertificateCommand, byte[]>,
       IApplicationRequestHandler<GenerateCertificateCommand, byte[]>
    {
        private readonly IPdfPrintService _pdfPrintService;

        public GenerateCertificateCommandHandler(IApplicationDbContext context, IPdfPrintService pdfPrintService)
        {
            _pdfPrintService = pdfPrintService;
        }

        public async Task<byte[]> Handle(GenerateCertificateCommand request, CancellationToken cancellationToken)
        {
            return await _pdfPrintService.GeneratePdf(TemplatesNames.PDFs.CertificateTraining, request.Data, true, true, false);
        }
    }
}