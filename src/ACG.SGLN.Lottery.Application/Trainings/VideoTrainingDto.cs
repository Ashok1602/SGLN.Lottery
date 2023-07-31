using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Entities;

namespace ACG.SGLN.Lottery.Application.Trainings
{
    public class VideoTrainingDto : IMapFrom<Training>, IMapTo<Training>
    {
        public string Title { get; set; }
        public string CourseURI { get; set; }
    }
}