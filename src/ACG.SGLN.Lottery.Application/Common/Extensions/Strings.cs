using System;

namespace ACG.SGLN.Lottery.Application.Common.Extensions
{
    public static class Strings
    {
        public static string AddPrefix(this string chainCharacters, string prefix)
        {
            if (chainCharacters.IsNullOrEmpty()) throw new ArgumentNullException(nameof(chainCharacters));

            if (prefix.IsNullOrEmpty()) throw new ArgumentNullException(nameof(prefix));

            return prefix + chainCharacters;
        }

        public static string AddSuffix(this string chainCharacters, string suffix)
        {
            if (chainCharacters.IsNullOrEmpty()) throw new ArgumentNullException(nameof(chainCharacters));

            if (suffix.IsNullOrEmpty()) return chainCharacters;

            return chainCharacters + suffix;
        }


        public static bool IsNullOrEmpty(this string chainCharacters)
        {
            return string.IsNullOrEmpty(chainCharacters);
        }

        public static bool IsNullOrWhiteSpace(this string chainCharacters)
        {
            return string.IsNullOrWhiteSpace(chainCharacters);
        }
    }
}