using ACG.SGLN.Lottery.Domain.Resources;
using System.Resources;

namespace System
{
    public static class EnumExtensions
    {
        public static string GetDescription(this Enum enumValue)
        {
            var resource = new ResourceManager(typeof(EnumResources));

            var resourceKey = $"{enumValue.GetType().Name}_{enumValue}";

            var displayName = resource?.GetString(resourceKey);

            return displayName ?? enumValue.ToString();
        }
    }
}
