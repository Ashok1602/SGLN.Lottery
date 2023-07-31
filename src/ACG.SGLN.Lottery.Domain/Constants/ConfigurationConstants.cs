using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Constants
{
    public static class ConfigurationConstants
    {
        public static class Sections
        {
            public const string Security = "Security";
            public const string Mail = "EmailOptions";
            public const string PrintFooterText = "PrintFooterText";
            public const string Urls = "Urls";
            public const string Nfs = "Nfs";
            public const string Messaging = "MessagingOptions";
            public const string Training = "TrainingOptions";
            public const string Invoice = "InvoiceOptions";
            public const string Ftp = "FTP";

        }

        public static class Topics
        {
            public const string All = "all";
            public const string Notified = "notified";
        }

        public static string GetFormattedFilePath(string fileName)
        {
            string year = DateTime.Now.Year.ToString();
            string month = DateTime.Now.Month.ToString().PadLeft(2);
            string day = DateTime.Now.Day.ToString().PadLeft(2);
            return $"{year}/{year}-{month}/{year}-{month}-{day}/{fileName}-{year}-{month}-{day}.txt.zip";
        }
        public static string GetRandomAlphaNumericReference(RequestNatureType RequestNature)
        {
            var random = new Random();
            //var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            //return DateTime.Now.ToString("yyMM") + new string(chars.Select(c => chars[random.Next(chars.Length)]).Take(6).ToArray());
            string Initial;
            if (RequestNature == RequestNatureType.Administration)
                Initial = "AF";
            else if (RequestNature == RequestNatureType.Technical)
                Initial = "TO";
            else
                Initial = "CM";
            return Initial + DateTime.Now.ToString("MMyy") + random.Next(100000, 999999);
        }

        public static string ConvertToRoman(int convertThis)
        {
            int leftovers;              //store mod results
            string RomanNumeral = "";   //store roman numeral string
            Dictionary<string, int> dict = new Dictionary<string, int>()
        {
            {"M", 1000},// 1000 = M
            {"CM", 900},// 900 = CM
            {"D", 500}, // 500 = D
            {"CD", 400},// 400 = CD
            {"C", 100}, // 100 = C
            {"XC", 90}, // 90 = XC
            {"L", 50},  // 50 = L
            {"XL", 40}, // 40 = XL
            {"X", 10},  // 10 = X
            {"IX", 9},  // 9 = IX
            {"V", 5},   // 5 = V
            {"IV", 4},  // 4 = IV
            {"I", 1},   // 1 = I
        };
            foreach (KeyValuePair<string, int> pair in dict)
            {
                if (convertThis >= pair.Value)
                {
                    leftovers = convertThis % pair.Value;
                    int remainder = (convertThis - leftovers) / pair.Value;
                    convertThis = leftovers;
                    while (remainder > 0)
                    {
                        RomanNumeral += pair.Key; remainder--;
                    }
                }
            }
            return RomanNumeral;
        }

        public static string IndexToCharacter(int index)
        {
            string[] Columns = new[] { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "az", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az", "ba", "bb", "bc" };
            if (index <= 0)
                throw new IndexOutOfRangeException("index must be a positive number");

            return Columns[index - 1];
        }
    }
}