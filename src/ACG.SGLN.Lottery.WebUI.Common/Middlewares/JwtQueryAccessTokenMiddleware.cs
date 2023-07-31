using ACG.SGLN.Lottery.Domain.Constants;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System.Linq;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Middlewares
{
    public class JwtQueryAccessTokenMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtQueryAccessTokenMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext context)
        {
            return BeginInvoke(context);
        }

        private Task BeginInvoke(HttpContext context)
        {
            StringValues values;

            if (string.IsNullOrEmpty(context.Request.Headers[HeaderNames.Authorization]) &&
                context.Request.Query.TryGetValue(WebConstants.HttpQueryTokenKey, out values))
            {
                var token = values.Single();
                if (!string.IsNullOrWhiteSpace(token))
                {
                    context.Request.Headers[HeaderNames.Authorization] = $"{WebConstants.HttpHeaderAuthorizationType} {token}";
                }
            }

            return _next.Invoke(context);
        }
    }

    public static class JwtQueryAccessTokenMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtQueryAccessToken(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtQueryAccessTokenMiddleware>();
        }
    }
}