using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Middlewares
{
    public class AntiforgeryMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IAntiforgery _antiForgery;

        public AntiforgeryMiddleware(RequestDelegate next, IAntiforgery antiForgery)
        {
            _next = next;
            _antiForgery = antiForgery;
        }

        public Task Invoke(HttpContext context)
        {
            return BeginInvoke(context);
        }

        private Task BeginInvoke(HttpContext context)
        {
            string path = context.Request.Path.Value;


            if (Regex.IsMatch(path, "^/api/Resources$", RegexOptions.IgnoreCase) &&
                string.Equals(context.Request.Method, "GET", StringComparison.OrdinalIgnoreCase))
            {
                var tokens = _antiForgery.GetAndStoreTokens(context);

                context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions() { HttpOnly = false });
            }

            return _next.Invoke(context);
        }
    }

    public static class AntiforgeryMiddlewareExtensions
    {
        public static IApplicationBuilder UseAntiforgery(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AntiforgeryMiddleware>();
        }
    }
}
