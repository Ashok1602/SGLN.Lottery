using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Retailers
{
    public class SalesRepresentativeDto : IMapFrom<Retailer>, IMapTo<Retailer>
    {
        public string SGLNCommercialName { get; set; }
        public string SGLNCommercialMail { get; set; }
        public string SGLNCommercialPhone { get; set; }
        public string SISALCommercialName { get; set; }
        public string SISALCommercialMail { get; set; }
        public string SISALCommercialPhone { get; set; }
        public bool IsMassAssignement { get; set; } = false;
        public string TargetMunicipality { get; set; }
    }
}