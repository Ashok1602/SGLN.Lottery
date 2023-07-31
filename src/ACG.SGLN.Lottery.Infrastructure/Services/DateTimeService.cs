using ACG.SGLN.Lottery.Application.Common.Interfaces;
using System;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.Now;
    }
}