using AutoMapper;

namespace ACG.SGLN.Lottery.Application.Common.Mappings
{
    public interface IMapFrom<T>
    {
        public virtual void Mapping(Profile profile)
        {
            profile.CreateMap(typeof(T), GetType());
        }
    }
}