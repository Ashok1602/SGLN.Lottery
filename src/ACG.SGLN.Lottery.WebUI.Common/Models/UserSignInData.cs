using System.ComponentModel.DataAnnotations;

namespace ACG.SGLN.Lottery.WebUI.Common.Models
{
    public class UserSignInData
    {
        public UserSignInData() { }

        [Required] public string Username { get; set; }
        [Required] public string Password { get; set; }
    }
}