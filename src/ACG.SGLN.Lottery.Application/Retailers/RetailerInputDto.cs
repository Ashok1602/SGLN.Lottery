namespace ACG.SGLN.Lottery.Application.Requests
{
    public class RetailerInputDto
    {
        public string ContractNumber { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string InternalRetailerCode { get; set; }
        public string ExternalRetailerCode { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Activity { get; set; }
        public string TradeRegister { get; set; }
        public string ProfessionalTax { get; set; }
        public string TaxIdentification { get; set; }
        public string CompanyIdentifier { get; set; } //ICE
        public string AdressLatitude { get; set; }
        public string AdressLongitude { get; set; }
        public string Phone { get; set; }
        public string CommercialZone { get; set; }
        public string GeoCodeHCP { get; set; }
        public string Municipality { get; set; }
        public string AdministrativeRegion { get; set; }
        public string SISALCommercialName { get; set; }
        public string SGLNCommercialName { get; set; }
        public string WeeklySalesLimit { get; set; }
        public string AnnualCA { get; set; }
        public string WeeksNumber { get; set; }
    }
}