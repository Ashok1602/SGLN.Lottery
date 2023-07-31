using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class RequestObjectCriterea
    {
        public string Title { get; set; }
        public Guid? RequestCategoryId { get; set; }
        public RequestNatureType? RequestNature { get; set; }
    }
}