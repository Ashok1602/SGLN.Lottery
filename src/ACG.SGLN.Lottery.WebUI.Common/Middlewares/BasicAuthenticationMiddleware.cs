using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Options;
using IdentityModel.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Middlewares
{
    /// <summary>
    /// 
    /// </summary>
    public class BasicAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="next"></param>
        public BasicAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public Task Invoke(HttpContext context, IOptions<SecurityOptions> options)
        {
            return BeginInvoke(context, options);
        }

        private Task BeginInvoke(HttpContext context, IOptions<SecurityOptions> options)
        {
            if (!string.IsNullOrEmpty(context.Request.Headers[HeaderNames.Authorization]))
            {
                var authHeader = AuthenticationHeaderValue.Parse(context.Request.Headers[HeaderNames.Authorization]);
                if (!string.IsNullOrEmpty(authHeader.Scheme) && authHeader.Scheme.ToLower().StartsWith("basic"))
                {
                    var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                    var credentials = Encoding.UTF8.GetString(credentialBytes).Split(new[] { ':' }, 2);

                    var discoveryClient = new HttpClient();
                    var discovery = discoveryClient.GetDiscoveryDocumentAsync()
                        .GetAwaiter().GetResult();
                    if (!discovery.IsError)
                    {
                        var tokenResponse = discoveryClient.RequestPasswordTokenAsync(new PasswordTokenRequest
                        {
                            Address = discovery.TokenEndpoint,
                            ClientId = "ACG.SGLN.Lottery.WebUI.Api",
                            UserName = credentials[0],
                            Password = credentials[1]
                        }).GetAwaiter().GetResult();

                        if (!tokenResponse.IsError)
                        {
                            context.Request.Headers[HeaderNames.Authorization] =
                                $"{WebConstants.HttpHeaderAuthorizationType} {tokenResponse.AccessToken}";
                        }
                    }
                }
            }

            return _next.Invoke(context);
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public static class BasicAuthenticationMiddlewareExtensions
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="builder"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseBasicAuthentication(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<BasicAuthenticationMiddleware>();
        }
    }
}