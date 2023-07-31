using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Constants;
using IdentityModel.Client;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebApi.Mobile.IntegrationTests.ControllerTests
{
    public abstract class BaseControllerTests<TEntity, TDto, TVm> : IClassFixture<CustomWebApplicationFactory<Startup>>
        where TEntity : class
        where TDto : class
        where TVm : class
    {
        protected BaseControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            HttpClient = factory.CreateClient();
            var discoveryClient = new HttpClient();
            var discovery = discoveryClient.GetDiscoveryDocumentAsync("https://autohallvo-account.azurewebsites.net")
                .GetAwaiter().GetResult();
            if (discovery.IsError)
            {
                Console.WriteLine(discovery.Error);
                return;
            }

            var tokenResponse = discoveryClient.RequestPasswordTokenAsync(new PasswordTokenRequest
            {
                Address = discovery.TokenEndpoint,
                ClientId = "ACG.SGLN.Lottery.WebUI.XUnit",
                Scope = "FoApi",
                UserName = AuthorizationConstants.DefaultUserName,
                Password = AuthorizationConstants.DefaultPassword
            }).GetAwaiter().GetResult();

            if (!tokenResponse.IsError)
            {
                HttpClient.SetBearerToken(tokenResponse.AccessToken);
                //HttpClient.DefaultRequestHeaders.Add("content-type", "application/json");
                HttpClient.DefaultRequestHeaders.Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }
        }

        protected HttpClient HttpClient { get; }

        protected abstract string GetRequestUri();

        protected ByteArrayContent CreatePostBody(object obj)
        {
            var content = JsonConvert.SerializeObject(obj);
            var buffer = Encoding.UTF8.GetBytes(content);
            var byteContent = new ByteArrayContent(buffer);

            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            return byteContent;
        }

        protected virtual async Task<TEntity> GetResponseContent(HttpResponseMessage httpResponse)
        {
            var content = await httpResponse.Content.ReadAsStringAsync();
            Console.WriteLine(content);
            return JsonConvert.DeserializeObject<TEntity>(content);
        }

        protected virtual async Task<PagedResult<TEntity>> GetResponsePagedListContent(HttpResponseMessage httpResponse)
        {
            var content = await httpResponse.Content.ReadAsStringAsync();
            Console.WriteLine(content);
            return JsonConvert.DeserializeObject<PagedResult<TEntity>>(content);
        }

        protected virtual async Task<TEntity> TryAdd(TDto dto, HttpStatusCode? statusCode = null)
        {
            var httpResponse = await HttpClient.PostAsync(GetRequestUri(), CreatePostBody(dto));
            if (statusCode == null)
                httpResponse.EnsureSuccessStatusCode();
            else
                Assert.Equal(statusCode, httpResponse.StatusCode);

            return await GetResponseContent(httpResponse);
        }

        protected virtual async Task<TEntity> TryUpdate(object id, TDto dto, HttpStatusCode? statusCode = null)
        {
            var httpResponse = await HttpClient.PutAsync($"{GetRequestUri()}/{id}", CreatePostBody(dto));
            if (statusCode == null)
                httpResponse.EnsureSuccessStatusCode();
            else
                Assert.Equal(statusCode, httpResponse.StatusCode);

            return await GetResponseContent(httpResponse);
        }

        protected virtual async Task<TEntity> TryGetById(string id, HttpStatusCode? statusCode = null)
        {
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}/{id}");
            if (statusCode == null)
                httpResponse.EnsureSuccessStatusCode();
            else
                Assert.Equal(statusCode, httpResponse.StatusCode);

            return await GetResponseContent(httpResponse);
        }

        protected virtual async Task TryDelete(object id, HttpStatusCode? statusCode = null)
        {
            var httpResponse = await HttpClient.DeleteAsync($"{GetRequestUri()}/{id}");
            if (statusCode == null)
                httpResponse.EnsureSuccessStatusCode();
            else
                Assert.Equal(statusCode, httpResponse.StatusCode);
        }
    }
}