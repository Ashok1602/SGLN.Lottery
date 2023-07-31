namespace ACG.SGLN.Lottery.Domain.Common
{
    public interface IDeletableEntity
    {
        public bool? IsDeleted { get; set; }
    }
}