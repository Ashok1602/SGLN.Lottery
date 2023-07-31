using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;

namespace ACG.SGLN.Lottery.Application.Trainings
{
    public class LiveTrainingDto : IMapFrom<Training>, IMapTo<Training>
    {
        public string Title { get; set; }
        public string CourseURI { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public IFormFile SupportDocument { get; set; }
    }
}