using ACG.SGLN.Lottery.Domain.Enums;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class RequestCategoriesCriterea
    {
        public string Title { get; set; }
        public RequestNatureType? RequestNature { get; set; }
    }
}