using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using ACG.SGLN.Lottery.Domain.Options;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Invoices.Commands.SynchronizationInvoices
{
    [AnonymousAccess]
    public class SynchronizationInvoicesCommand : IRequest<Unit>
    {
    }

    public class SynchronizationInvoicesCommandHandler : IRequestHandler<SynchronizationInvoicesCommand, Unit>,
        IApplicationRequestHandler<SynchronizationInvoicesCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly IFtpFileService _ftpFileService;
        private readonly IZipFileService _zipFileService;
        private readonly IExcelReadService _excelReadService;
        private readonly FTPOptions _ftpOptions;

        public SynchronizationInvoicesCommandHandler(IApplicationDbContext dbContext, IFtpFileService ftpFileService,
            IExcelReadService excelReadService, IOptions<FTPOptions> options, IZipFileService zipFileService)
        {
            _dbcontext = dbContext;
            _ftpFileService = ftpFileService;
            _excelReadService = excelReadService;
            _ftpOptions = options?.Value;
            _zipFileService = zipFileService;
        }

        public async Task<Unit> Handle(SynchronizationInvoicesCommand request, CancellationToken cancellationToken)
        {
            byte[] ftpFileData = await _ftpFileService.GetFtpFileAsync($"{_ftpOptions.BasePath}/{ConfigurationConstants.GetFormattedFilePath(_ftpOptions.InvoicesPath)}");
            byte[] unzipedFile = await _zipFileService.GetFileContent(ftpFileData, 0);
            if (unzipedFile != null) //TODO: handle the else based on caller 
            {
                List<InvoiceInputDto> Invoicess = _excelReadService.ReadCSV<InvoiceInputDto>(unzipedFile);

                List<Invoice> InvoicessEntities = Invoicess.Select(i => GetEntityFromDto(i)).Where(i => i != null).ToList();

                await _dbcontext.Invoices.AddRangeAsync(InvoicessEntities);

                await _dbcontext.SaveChangesAsync(cancellationToken);
            }
            return Unit.Value;
        }

        private Invoice GetEntityFromDto(InvoiceInputDto i)
        {
            Retailer r = _dbcontext.Retailers.Where(r => r.InternalRetailerCode == i.InternalRetailerCode).FirstOrDefault();
            if (r == null)
                return null;

            Invoice res = new Invoice
            {
                Retailer = r,
                Reference = i.Reference,
                Status = i.Status == "Payée" ? InvoiceStatusType.Paid : InvoiceStatusType.Unpaid,
                Date = Convert.ToDateTime(i.Date),
                Amount = i.Amount
            };
            return res;
        }
    }
}
