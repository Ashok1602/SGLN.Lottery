namespace ACG.SGLN.Lottery.Application.Users
{
    public class UserResetDto
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string Code { get; set; }
    }
}