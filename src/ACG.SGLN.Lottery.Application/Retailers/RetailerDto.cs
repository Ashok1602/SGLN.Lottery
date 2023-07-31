using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using AutoMapper;

namespace ACG.SGLN.Lottery.Application.Retailers
{
    public class RetailerDto : IMapFrom<Retailer>, IMapTo<Retailer>
    {
        public string Civility { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string InternalRetailerCode { get; set; } //SGLN retailer identifier
        public string ExternalRetailerCode { get; set; } //SAP retailer identifier MR0001..
        public double WeeklySalesLimit { get; set; } //limite plafond de vente de la semaine
        public double AnnualCA { get; set; }
        public double TotalCommissions { get; set; }
        public double TotalUnpaid { get; set; }
        public string ContractNumber { get; set; }
        public string CompanyIdentifier { get; set; } // ICE / RC / TP
        public string Activity { get; set; }
        public string GeographicSector { get; set; }
        public double AdressLatitude { get; set; }
        public double AdressLongitude { get; set; }
        public string AgentEmail { get; set; }
        public string TradeRegister { get; set; }
        public string ProfessionalTax { get; set; }
        public string GPSCoordinates { get; set; }
        public string CommercialZone { get; set; }
        public string GeoCodeHCP { get; set; }
        public string Municipality { get; set; }
        public string AdministrativeRegion { get; set; }
        public string SGLNCommercialName { get; set; }
        public string SGLNCommercialPhone { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<RetailerDto, User>()
                .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.Phone));
            profile.CreateMap<RetailerDto, Retailer>();
        }
    }
}