using System.ComponentModel.DataAnnotations;

namespace ACG.SGLN.Lottery.Application.Users
{
    public class ChangePasswordData
    {
        [Required]
        public string CurrentPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}