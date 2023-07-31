using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Retailers
{
    public class GetRetailerDto : IMapFrom<Retailer>, IMapTo<Retailer>
    {
        public string Civility { get; set; }
        public string Userid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string InternalRetailerCode { get; set; }
        public string ExternalRetailerCode { get; set; }
        public double WeeklySalesLimit { get; set; }
        public double AnnualCA { get; set; }
        public double TotalCommissions { get; set; }
        public double TotalUnpaid { get; set; }
        public string ContractNumber { get; set; }
        public string CompanyIdentifier { get; set; }
        public string Activity { get; set; }
        public string GeographicSector { get; set; }
        public bool IsDeactivated { get; set; } = false;
        public bool IsValidated { get; set; } = false;
        public string SGLNCommercialName { get; set; }
        public string SGLNCommercialPhone { get; set; }
        public string SGLNCommercialMail { get; set; }
        public string SISALCommercialName { get; set; }
        public string SISALCommercialMail { get; set; }
        public string SISALCommercialPhone { get; set; }

    }
}