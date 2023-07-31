using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Requests.Queries.GetRequestCommentsById
{
    public class GetRetailersFromFileQuery : IRequest<Unit>
    {
        public byte[] FileData { get; set; }
    }

    public class GetRetailersFromFileQueryHandler : IRequestHandler<GetRetailersFromFileQuery, Unit>
    {
        protected readonly IApplicationDbContext _context;
        protected readonly IExcelReadService _excelReadService;
        private readonly IIdentityService _identityService;

        public GetRetailersFromFileQueryHandler(IApplicationDbContext context, IExcelReadService excelReadService, IIdentityService identityService)
        {
            _identityService = identityService;
            _context = context;
            _excelReadService = excelReadService;
        }

        public async Task<Unit> Handle(GetRetailersFromFileQuery request,
            CancellationToken cancellationToken)
        {

            List<RetailerInputDto> Retailers = _excelReadService.ReadExcel<RetailerInputDto>(request.FileData, 0, true);

            List<Retailer> RetailersEntities = Retailers.Select(i => GetEntityFromDto(i)).Where(i => i != null).ToList();

            await _context.Retailers.AddRangeAsync(RetailersEntities);

            await _context.SaveChangesAsync(cancellationToken);
            return Unit.Value;

        }

        private Retailer GetEntityFromDto(RetailerInputDto i)
        {
            try
            {
                Retailer ret = new Retailer
                {
                    ContractNumber = i.ContractNumber,
                    LastName = i.LastName,
                    FirstName = i.FirstName,
                    InternalRetailerCode = i.InternalRetailerCode,
                    ExternalRetailerCode = i.ExternalRetailerCode,
                    Address = i.Address,
                    City = i.City,
                    Activity = i.Activity,
                    TradeRegister = i.TradeRegister,
                    ProfessionalTax = i.ProfessionalTax,
                    TaxIdentification = i.TaxIdentification,
                    CompanyIdentifier = i.CompanyIdentifier,
                    AdressLatitude = !string.IsNullOrEmpty(i.AdressLatitude) ? double.Parse(i.AdressLatitude) : 0.0,
                    AdressLongitude = !string.IsNullOrEmpty(i.AdressLongitude) ? double.Parse(i.AdressLongitude) : 0.0,
                    Phone = i.Phone,
                    CommercialZone = i.CommercialZone,
                    GeoCodeHCP = i.GeoCodeHCP,
                    Municipality = i.Municipality,
                    AdministrativeRegion = i.AdministrativeRegion,
                    SISALCommercialName = i.SISALCommercialName,
                    SGLNCommercialName = i.SGLNCommercialName,
                    WeeklySalesLimit = !string.IsNullOrEmpty(i.WeeklySalesLimit) ? double.Parse(i.WeeklySalesLimit) : 0.0,
                    AnnualCA = !string.IsNullOrEmpty(i.AnnualCA) ? double.Parse(i.AnnualCA) : 0.0,
                    WeeksNumber = !string.IsNullOrEmpty(i.WeeksNumber) ? int.Parse(i.WeeksNumber) : 0
                };

                var user = CreateUserRetailerAsync(ret, _identityService).Result;
                if (user != null)
                    ret.UserId = user.Id;
                return ret;
            }
            catch { }
            return null;
        }


        private static async Task<User> CreateUserRetailerAsync(Retailer ret, IIdentityService _identityService)
        {
            User user = new User()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = $"{ret.InternalRetailerCode}@sgln",
                Email = $"{ret.InternalRetailerCode}@loterie.ma",
                FirstName = ret.FirstName,
                LastName = ret.LastName,
                IsValidated = true,
                IsDeactivated = false,
                PhoneNumber = ret.Phone,
                RoleName = AuthorizationConstants.Roles.Retailers
            };
            var userExist = _identityService.GetUserByEmail(user.Email).Result;
            if (userExist != null)
                return userExist;
            else
                return await _identityService.CreateUserAsync(user);
        }
    }
}