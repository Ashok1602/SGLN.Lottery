namespace ACG.SGLN.Lottery.Domain.Common
{
    public abstract class TitledData : BaseEntity<int>
    {
        public virtual string Title { get; set; }
        public virtual string NormalizedTitle { get; set; }
    }
}