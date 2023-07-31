﻿using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using System;

namespace ACG.SGLN.Lottery.Application.Retailers
{
    public class RetailerDetailsDto : IMapFrom<Retailer>, IMapTo<Retailer>
    {
        public Guid Id { get; set; }
        public string Civility { get; set; }
        public string Userid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string InternalRetailerCode { get; set; }
        public string ExternalRetailerCode { get; set; }
        public string Activity { get; set; }
        public string AgentEmail { get; set; }
        public string AgentUserName { get; set; }
        public string AgentFirstName { get; set; }
        public string AgentLastName { get; set; }
        public string AgentPhoneNumber { get; set; }
        public double WeeklySalesLimit { get; set; } //limite plafond de vente de la semaine
        public double AnnualCA { get; set; }
        public double TotalCommissions { get; set; }
        public double TotalUnpaid { get; set; }
        public string ContractNumber { get; set; }
        public string CompanyIdentifier { get; set; } // ICE / RC / TP
        public string GeographicSector { get; set; }
        public double CurrentBalance { get; set; }
        public double AdressLatitude { get; set; }
        public double AdressLongitude { get; set; }
        public string SGLNCommercialName { get; set; }
        public string SGLNCommercialPhone { get; set; }
        public string SGLNCommercialMail { get; set; }
        public string SISALCommercialName { get; set; }
        public string SISALCommercialMail { get; set; }
    }
}