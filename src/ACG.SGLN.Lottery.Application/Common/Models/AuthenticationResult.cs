using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Common.Models
{
    public class AuthenticationResult
    {
        public bool Succeeded { get; set; }
        public bool IsLockedOut { get; set; }
        public bool IsNotAllowed { get; set; }
        public string AccessToken { get; set; }
        public bool IsTemporaryPassword { get; set; }
        public List<string> Errors { get; set; }
    }
}