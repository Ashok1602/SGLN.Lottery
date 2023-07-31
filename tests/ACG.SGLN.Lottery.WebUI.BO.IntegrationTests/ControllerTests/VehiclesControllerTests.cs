using ACG.SGLN.Lottery.Application.Vehicles;
using ACG.SGLN.Lottery.Domain.Entities;
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebUI.BO.IntegrationTests.ControllerTests
{
    public class VehiclesControllerTests : BaseControllerTests<Vehicle, VehicleDto, VehiclesVm>
    {
        public VehiclesControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }

        [Fact(DisplayName = "Test Vehicle Listing Paginated")]
        public async Task ShouldGetVehiclePagedList()
        {
            int page = 1, size = 5;
            //[2] Getting Vehicules

            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={page}&size={size}");
            httpResponse.EnsureSuccessStatusCode();

            //[2] List Vehicule
            var pagedResult = await GetResponsePagedListContent(httpResponse);

            pagedResult.Results.Count.Should().Be(size);
            pagedResult.PageCount.Should().Be(3);
        }

        [Fact(DisplayName = "Test Vehicle get by Id")]
        public async Task ShouldGetVehicleById()
        {
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={1}&size={1}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);
            var itemFromList = pagedResult.Results[0];

            var addedItem = await TryGetById(itemFromList.Id.ToString());

            addedItem.Should().NotBeNull();
            addedItem.Brand.Should().Be(itemFromList.Brand);
            addedItem.Model.Should().Be(itemFromList.Model);
        }

        //[Fact(DisplayName = "Test Vehicle deletion")]
        //public async Task ShouldDeleteVehicle()
        //{
        //    var newItem = new VehicleDto
        //    {
        //        Id = Guid.NewGuid(),
        //        Brand = "Ford",
        //        Model = "Focus",
        //        ChassisNumber = "WX254747KL87",
        //        Mileage = 160000,
        //        ReleaseDate = DateTime.Now.AddYears(-2),
        //        BodyStyle = VehicleBodyStyle.Coupe,
        //        Condition = VehicleCondition.Used,
        //        FuelType = VehicleFuelType.Diesel,
        //        LastStatus = VehicleStatusType.Active
        //    };

        //    //[1] add vehicle
        //    var httpResponse = await HttpClient.PostAsync(GetRequestUri(), CreatePostBody(newItem));
        //    httpResponse.EnsureSuccessStatusCode();

        //    //[2] delete vehicle
        //    await TryDelete(newItem.Id.ToString());

        //    var deletedItem = await TryGetById(newItem.Id.ToString());

        //    deletedItem.Should().BeNull();
        //}

        [Fact(DisplayName = "Test Vehicle Update")]
        public async Task ShouldUpdateVehicle()
        {
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={1}&size={1}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);

            // Get first item
            var itemUpdate = pagedResult.Results[0];

            //[2] update vehicle
            itemUpdate.Mileage = 200000;
            itemUpdate.Price = 130000;
            httpResponse = await HttpClient.PutAsync($"{GetRequestUri()}/{itemUpdate.Id}", CreatePostBody(itemUpdate));
            httpResponse.EnsureSuccessStatusCode();

            itemUpdate.Mileage.Should().NotBe(pagedResult.Results[0].Mileage);
            itemUpdate.Price.Should().NotBe(pagedResult.Results[0].Price);
        }

        protected override string GetRequestUri()
        {
            return "/api/Vehicles";
        }
    }
}