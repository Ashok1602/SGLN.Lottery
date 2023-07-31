
using ACG.SGLN.Lottery.Application.Common.Exceptions;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Retailers.Commands
{
    public class UpdateRetailersCommand : IRequest<List<Retailer>>
    {
        public List<RetailerUpdateDto> Data { get; set; }
    }

    public class UpdateRetailersCommandHandler : IRequestHandler<UpdateRetailersCommand, List<Retailer>>,
        IApplicationRequestHandler<UpdateRetailersCommand, List<Retailer>>
    {
        private readonly IApplicationDbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;

        public UpdateRetailersCommandHandler(IApplicationDbContext dbContext, IIdentityService identityService, IMapper mapper)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _mapper = mapper;
        }

        public async Task<List<Retailer>> Handle(UpdateRetailersCommand request, CancellationToken cancellationToken)
        {
            List<Retailer> retailersUpdated = new List<Retailer>();

            foreach (var retailer in request.Data)
            {
                var entity = await _dbContext.Set<Retailer>().Where(r => r.ExternalRetailerCode == retailer.ExternalRetailerCode).FirstOrDefaultAsync();

                if (entity == null)
                    throw new NotFoundException(nameof(Retailer), retailer.ExternalRetailerCode);

                if (!string.IsNullOrEmpty(retailer.FirstName))
                    entity.FirstName = retailer.FirstName;

                if (!string.IsNullOrEmpty(retailer.LastName))
                    entity.LastName = retailer.LastName;

                if (!string.IsNullOrEmpty(retailer.Phone))
                    entity.Phone = retailer.Phone;

                if (!string.IsNullOrEmpty(retailer.Civility))
                    entity.Civility = retailer.Civility;

                if (!string.IsNullOrEmpty(retailer.Address))
                    entity.Address = retailer.Address;

                if (!string.IsNullOrEmpty(retailer.InternalRetailerCode))
                    entity.InternalRetailerCode = retailer.InternalRetailerCode;

                if (!string.IsNullOrEmpty(retailer.ExternalRetailerCode))
                    entity.ExternalRetailerCode = retailer.ExternalRetailerCode;

                if (!string.IsNullOrEmpty(retailer.ContractNumber))
                    entity.ContractNumber = retailer.ContractNumber;

                if (!string.IsNullOrEmpty(retailer.Activity))
                    entity.Activity = retailer.Activity;

                if (!string.IsNullOrEmpty(retailer.GeographicSector))
                    entity.GeographicSector = retailer.GeographicSector;

                if (!string.IsNullOrEmpty(retailer.CompanyIdentifier))
                    entity.CompanyIdentifier = retailer.CompanyIdentifier;

                if (retailer.AnnualCA.HasValue)
                    entity.AnnualCA = retailer.AnnualCA.Value;

                if (retailer.WeeklySalesLimit.HasValue)
                    entity.WeeklySalesLimit = retailer.WeeklySalesLimit.Value;

                if (retailer.TotalUnpaid.HasValue)
                    entity.TotalUnpaid = retailer.TotalUnpaid.Value;

                if (retailer.TotalCommissions.HasValue)
                    entity.TotalCommissions = retailer.TotalCommissions.Value;

                if (retailer.AdressLatitude.HasValue)
                    entity.AdressLatitude = retailer.AdressLatitude.Value;

                if (retailer.AdressLongitude.HasValue)
                    entity.AdressLongitude = retailer.AdressLongitude.Value;

                if (!string.IsNullOrEmpty(retailer.TradeRegister))
                    entity.TradeRegister = retailer.TradeRegister;

                if (!string.IsNullOrEmpty(retailer.ProfessionalTax))
                    entity.ProfessionalTax = retailer.ProfessionalTax;

                if (!string.IsNullOrEmpty(retailer.GPSCoordinates))
                    entity.GPSCoordinates = retailer.GPSCoordinates;

                if (!string.IsNullOrEmpty(retailer.CommercialZone))
                    entity.CommercialZone = retailer.CommercialZone;

                if (!string.IsNullOrEmpty(retailer.GeoCodeHCP))
                    entity.GeoCodeHCP = retailer.GeoCodeHCP;

                if (!string.IsNullOrEmpty(retailer.Municipality))
                    entity.Municipality = retailer.Municipality;

                if (!string.IsNullOrEmpty(retailer.AdministrativeRegion))
                    entity.AdministrativeRegion = retailer.AdministrativeRegion;

                if (!string.IsNullOrEmpty(retailer.SGLNCommercialName))
                    entity.SGLNCommercialName = retailer.SGLNCommercialName;

                if (!string.IsNullOrEmpty(retailer.SGLNCommercialPhone))
                    entity.SGLNCommercialPhone = retailer.SGLNCommercialPhone;

                if (!string.IsNullOrEmpty(retailer.SGLNCommercialMail))
                    entity.SGLNCommercialMail = retailer.SGLNCommercialMail;

                if (!string.IsNullOrEmpty(retailer.SISALCommercialMail))
                    entity.SISALCommercialMail = retailer.SISALCommercialMail;

                if (!string.IsNullOrEmpty(retailer.SISALCommercialName))
                    entity.SISALCommercialName = retailer.SISALCommercialName;

                if (!string.IsNullOrEmpty(retailer.AgentEmail))
                {
                    var agent = await _identityService.GetUserByEmailAsync(retailer.AgentEmail);
                    entity.AgentId = agent.Id;
                }

                await _identityService.UpdateUserAsync(entity.UserId, _mapper.Map<User>(retailer));

                _dbContext.Entry(entity).State = EntityState.Modified;

                await _dbContext.SaveChangesAsync(cancellationToken);
                retailersUpdated.Add(entity);
            }
            return retailersUpdated;
        }
    }
}
