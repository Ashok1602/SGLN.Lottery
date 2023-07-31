using ACG.SGLN.Lottery.Application.StorageAreas;
using ACG.SGLN.Lottery.Domain.Entities;
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebUI.BO.IntegrationTests.ControllerTests
{
    public class StorageAreasControllerTests : BaseControllerTests<StorageArea, StorageAreaDto, StorageAreasVm>
    {
        public StorageAreasControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }


        [Fact(DisplayName = "Test StorageAreas Listing Paginated")]
        public async Task ShouldGetStorageAreasPagedList()
        {
            int page = 1, size = 5;
            //[2] Getting StorageAreas

            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={page}&size={size}");
            httpResponse.EnsureSuccessStatusCode();

            //[2] List StorageAreas
            var pagedResult = await GetResponsePagedListContent(httpResponse);

            pagedResult.Results.Count.Should().Be(size);
            pagedResult.PageCount.Should().Be(3);
        }

        [Fact(DisplayName = "Test StorageArea get by Id")]
        public async Task ShouldGetCustomerById()
        {
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={1}&size={1}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);
            var itemFromList = pagedResult.Results[0];
            var addedItem = await TryGetById(itemFromList.Id.ToString());

            addedItem.Should().NotBeNull();
            addedItem.Name.Should().Be(itemFromList.Name);
        }

        protected override string GetRequestUri()
        {
            return "api/StorageAreas";
        }
    }
}