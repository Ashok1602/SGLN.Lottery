namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class Announcement : AbstractDocument
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public bool IsPublished { get; set; } = false;
    }
}
