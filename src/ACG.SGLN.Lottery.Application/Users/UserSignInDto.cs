using System.ComponentModel.DataAnnotations;

namespace ACG.SGLN.Lottery.Application.Users
{
    public class UserSignInDto
    {
        public UserSignInDto() { }

        [Required] public string UserName { get; set; }
        [Required] public string Password { get; set; }

        public string DeviceToken { get; set; }
    }
}