namespace ACG.SGLN.Lottery.Domain.Entities
{
    public static class RetailerExtensions
    {
        public static string GetName(this Retailer retailer)
        {
            return $"{retailer.LastName} {retailer.FirstName}";
        }
    }
}
