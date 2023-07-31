using ACG.SGLN.Lottery.Domain.Enums;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RequestCategory : AbstractDocument
    {
        public List<RequestObject> RequestObjects { get; set; } = new List<RequestObject>();
        public string Title { get; set; }
        public bool IsDeactivated { get; set; } = false;
        public RequestNatureType RequestNature { get; set; }
    }
}
