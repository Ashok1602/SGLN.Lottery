using ACG.SGLN.Lottery.Application.Common.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Queries
{
    public class GeneratePdfTestQuery : IRequest<byte[]>
    {
    }


    public class GeneratePdfTestQueryHandler : IRequestHandler<GeneratePdfTestQuery, byte[]>
    {
        private readonly IPdfPrintService _pdfPrintService;

        public GeneratePdfTestQueryHandler(IPdfPrintService pdfPrintService)
        {
            _pdfPrintService = pdfPrintService;
        }

        public async Task<byte[]> Handle(GeneratePdfTestQuery request,
            CancellationToken cancellationToken)
        {
            return await _pdfPrintService.GeneratePdf<string>("Test", "test pdf");
        }


    }
}