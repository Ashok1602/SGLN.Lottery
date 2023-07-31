using ACG.SGLN.Lottery.Domain.Common;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class Retailer : ContactBasedEntity, IHasDocuments<RetailerDocument>
    {
        public string Civility { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserId { get; set; }
        public string AgentId { get; set; }
        public string InternalRetailerCode { get; set; } //SGLN retailer identifier
        public string ExternalRetailerCode { get; set; } //SAP retailer identifier MR0001..
        public double CurrentBalance { get; set; }
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

        public bool IsNotified { get; set; } = false;
        public string TradeRegister { get; set; }
        public string ProfessionalTax { get; set; }
        public string GPSCoordinates { get; set; }
        public string CommercialZone { get; set; }
        public string GeoCodeHCP { get; set; }
        public string Municipality { get; set; }
        public string AdministrativeRegion { get; set; }
        public string SGLNCommercialName { get; set; }
        public string SGLNCommercialPhone { get; set; }
        public string SGLNCommercialMail { get; set; }
        public string TaxIdentification { get; set; }
        public string SISALCommercialName { get; set; }
        public string SISALCommercialMail { get; set; }
        public string SISALCommercialPhone { get; set; }
        public int WeeksNumber { get; set; }
        public string Classification { get; set; }
        public int LoyalityPoints { get; set; }
        public bool IsDeactivated { get; set; } = false;
        public List<RetailerDocument> Documents { get; set; }
        public List<Invoice> Invoices { get; set; }
        public List<RetailerNotification> RetailerNotifications { get; set; }
    }
}
