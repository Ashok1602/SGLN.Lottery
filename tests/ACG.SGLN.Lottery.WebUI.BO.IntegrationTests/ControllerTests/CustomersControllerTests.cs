using ACG.SGLN.Lottery.Application.Customers;
using ACG.SGLN.Lottery.Application.VehiclePurchases;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebUI.BO.IntegrationTests.ControllerTests
{
    public class CustomersControllerTests : BaseControllerTests<Customer, CustomerDto, CustomersVm>
    {
        public CustomersControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }

        private async Task CreateTestVehiclePurchasesToSeedCustomers()
        {
            var newItem = new VehiclePurchaseDto
            {
                Id = Guid.NewGuid(),
                FirstName = "Ilyas",
                LastName = "Belhaj",
                City = "Salé",
                Civility = "M.",
                Email = "ilyas@gmail.com",
                Phone = "06152367" + new Random().Next(10, 99),
                Brand = "Hyandai",
                Model = "Accent",
                //ChassisNumber = "WX254747YL" + new Random().Next(10, 99),
                Mileage = 160000,
                ReleaseDate = DateTime.Now.AddYears(-6),
                RegistrationType = VehicleRegistrationType.Local,
                DesiredVehicleCondition = VehicleCondition.New,
                DesiredVehicleBrand = "Ford",
                DesiredVehicleModel = "Focus"
            };
            var newItem2 = new VehiclePurchaseDto
            {
                Id = Guid.NewGuid(),
                FirstName = "Amine",
                LastName = "Narjiss",
                City = "Témara",
                Civility = "M.",
                Email = "Amine@gmail.com",
                Phone = "06152327" + new Random().Next(10, 99),
                Brand = "Kia",
                Model = "Picanto",
                //ChassisNumber = "WX254678YL" + new Random().Next(10, 99),
                Mileage = 20000,
                ReleaseDate = DateTime.Now.AddYears(-3),
                RegistrationType = VehicleRegistrationType.Local,
                DesiredVehicleCondition = VehicleCondition.New,
                DesiredVehicleBrand = "Ford",
                DesiredVehicleModel = "Fiesta"
            };

            //[1] create Vehicles Purchases
            await TryAdd(newItem, null, "/api/VehiclePurchases");
            await TryAdd(newItem2, null, "/api/VehiclePurchases");
        }

        [Fact(DisplayName = "Test Customers Listing Paginated")]
        public async Task ShouldGetCustomersPagedList()
        {
            await CreateTestVehiclePurchasesToSeedCustomers();
            int page = 1, size = 1;
            //[2] Getting Customers

            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={page}&size={size}");
            httpResponse.EnsureSuccessStatusCode();

            //[2] List Customers
            var pagedResult = await GetResponsePagedListContent(httpResponse);

            pagedResult.Results.Count.Should().Be(size);
            pagedResult.PageCount.Should().Be(2);

            //[3] Get by id
            var itemFromList = pagedResult.Results[0];
            var addedItem = await TryGetById(itemFromList.Id.ToString());

            addedItem.Should().NotBeNull();
            addedItem.FirstName.Should().Be(itemFromList.FirstName);

            //[4] Get customer vehicle purchases
            httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}/purchases");
            httpResponse.EnsureSuccessStatusCode();

            var purchases = await GetResponseContent<List<VehiclePurchase>>(httpResponse);
            purchases.Count.Should().Be(1);

        }

        [Fact(DisplayName = "Test Customer get by Id")]
        public async Task ShouldGetCustomerById()
        {
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={1}&size={1}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);

        }

        protected override string GetRequestUri()
        {
            return "api/customers";
        }
    }
}