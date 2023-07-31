using IdentityServer4.Validation;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.TokenRequestValidators
{
    public class TokenRequestValidator : ICustomTokenRequestValidator
    {
        public Task ValidateAsync(CustomTokenRequestValidationContext context)
        {
            return Task.CompletedTask;
        }
    }
}
