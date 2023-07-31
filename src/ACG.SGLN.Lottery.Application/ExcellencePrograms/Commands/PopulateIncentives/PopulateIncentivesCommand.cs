using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.ExcellencePrograms;
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

namespace ACG.SGLN.Lottery.Application.Notifications.Commands.CreateNotification
{
    [AnonymousAccess]
    public class PopulateIncentivesCommand : IRequest<Unit>
    {
    }

    public class PopulateIncentivesCommandHandler : IRequestHandler<PopulateIncentivesCommand, Unit>,
        IApplicationRequestHandler<PopulateIncentivesCommand, Unit>
    {
        private readonly IApplicationDbContext _dbcontext;
        private readonly IFtpFileService _ftpFileService;
        private readonly IZipFileService _zipFileService;
        private readonly IExcelReadService _excelReadService;
        private readonly FTPOptions _ftpOptions;

        public PopulateIncentivesCommandHandler(IApplicationDbContext dbContext, IFtpFileService ftpFileService,
            IExcelReadService excelReadService, IOptions<FTPOptions> options, IZipFileService zipFileService)
        {
            _dbcontext = dbContext;
            _ftpFileService = ftpFileService;
            _excelReadService = excelReadService;
            _ftpOptions = options?.Value;
            _zipFileService = zipFileService;
        }

        public async Task<Unit> Handle(PopulateIncentivesCommand request, CancellationToken cancellationToken)
        {
            byte[] ftpFileData = await _ftpFileService.GetFtpFileAsync($"{_ftpOptions.BasePath}/{ConfigurationConstants.GetFormattedFilePath(_ftpOptions.IncentivesPath)}");
            byte[] unzipedFile = await _zipFileService.GetFileContent(ftpFileData, 0);

            if (unzipedFile != null) //TODO: handle the else based on caller 
            {
                List<IncentiveInputDto> incentives = _excelReadService.ReadCSV<IncentiveInputDto>(unzipedFile);

                List<Incentive> IncentivesEntities = incentives.Select(i => GetEntityFromDto(i)).Where(i => i != null).ToList();

                await _dbcontext.Incentives.AddRangeAsync(IncentivesEntities);

                await _dbcontext.SaveChangesAsync(cancellationToken);
            }

            return Unit.Value;
        }

        private Incentive GetEntityFromDto(IncentiveInputDto i)
        {
            Retailer r = _dbcontext.Retailers.Where(r => r.InternalRetailerCode == i.InternalRetailerCode).FirstOrDefault();
            if (r == null)
                return null;

            Incentive res = new Incentive
            {
                Retailer = r,
                Bonus = i.Bonus,
                Achievement = i.Achievement,
                Goal = i.Goal,
                EndDate = Convert.ToDateTime(i.EndDate),
                StartDate = Convert.ToDateTime(i.StartDate),
                Type = (GameType)Enum.Parse(typeof(GameType), i.GameName)
            };
            return res;
        }
    }
}
