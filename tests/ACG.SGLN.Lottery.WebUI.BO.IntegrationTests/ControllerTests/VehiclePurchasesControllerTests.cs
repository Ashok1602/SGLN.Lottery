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
    public class VehiclePurchasesControllerTests : BaseControllerTests<VehiclePurchase, VehiclePurchaseDto
        , VehiclePurchasesVm>
    {
        public VehiclePurchasesControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }

        private async Task CreateTestVehiclePurchases()
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
            await TryAdd(newItem);
            await TryAdd(newItem2);
        }

        [Fact(DisplayName = "Test Vehicle Purchase Request Flow (Add vehicle purchase - eligibility - add technical expertise - Get Current technical Expertise - list paged - Get by Id)")]
        public async Task ShouldFollowVehicleRequestFlow()
        {
            //[1] create Vehicles Purchases
            await CreateTestVehiclePurchases();

            //[2] Getting Vehicles Purchases
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page=1&size=1");
            var vehiclePurchasesPaged = await GetResponsePagedListContent(httpResponse);

            vehiclePurchasesPaged.Results.Count.Should().Be(1);
            vehiclePurchasesPaged.PageCount.Should().Be(2);
            httpResponse.EnsureSuccessStatusCode();

            //[3] Eligibity
            var vehiclePurchaseId = vehiclePurchasesPaged.Results[0].Id;

            httpResponse =
                await HttpClient.PostAsync($"{GetRequestUri()}/{vehiclePurchaseId}/eligibility", CreatePostBody(new VehiclePurchaseEligibilityDto
                {
                    IsEligible = true,
                    Comment = "Bien"
                }));
            httpResponse.EnsureSuccessStatusCode();

            //[4] Get by id
            var eligibleVehiclePurchase = await TryGetById(vehiclePurchaseId.ToString());

            //[3] Eligibity
            eligibleVehiclePurchase.LastStatus.Should().Be(VehiclePurchaseStatusType.Accepted);

            //[5] Add technical Expertise
            httpResponse =
                await HttpClient.PostAsync($"{GetRequestUri()}/{vehiclePurchaseId}/technicalExpertises", null);
            httpResponse.EnsureSuccessStatusCode();
            var technicalExpertise = await GetResponseContent<TechnicalExpertise>(httpResponse);
            // 126 The number of registred parts to check (static number - would not be affected by any other api)
            technicalExpertise.CheckPartQuotations.Count.Should().Be(126);

            //[6] Get Current technical Expertise
            httpResponse =
               await HttpClient.GetAsync($"{GetRequestUri()}/{vehiclePurchaseId}/technicalExpertises/current");
            var currentTechnicalExpertise = await GetResponseContent<TechnicalExpertise>(httpResponse);
            httpResponse.EnsureSuccessStatusCode();

            currentTechnicalExpertise.Should().NotBeNull();
            currentTechnicalExpertise.LastStatus.Should().Be(technicalExpertise.LastStatus);

            //[7] Get technical expertise statuses
            httpResponse =
               await HttpClient.GetAsync($"{GetRequestUri()}/{vehiclePurchaseId}/statuses");
            httpResponse.EnsureSuccessStatusCode();
            var statuses = await GetResponseContent<List<VehiclePurchaseStatus>>(httpResponse);
            statuses.Count.Should().BeGreaterThan(0);
        }


        [Fact(DisplayName = "Test Vehicle Purchase Request Comment (Add a Comment ,Get comments of a Vehicle Purchase)")]
        public async Task ShouldCreateVehiclePurchaseComment()
        {
            //[1] create Vehicles Purchases
            await CreateTestVehiclePurchases();

            //[2] Getting Vehicles Purchases
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page=1&size=1");
            var vehiclePurchasesPaged = await GetResponsePagedListContent(httpResponse);

            //[3] Adding a comment to one
            var vehiclePurchaseId = vehiclePurchasesPaged.Results[0].Id;
            var commentItem = new VehiclePurchaseCommentDto
            {
                Title = "This is a test title",
                Body = "This is a test body"
            };
            httpResponse =
               await HttpClient.PostAsync($"{GetRequestUri()}/{vehiclePurchaseId}/comments", CreatePostBody(commentItem));
            httpResponse.EnsureSuccessStatusCode();
            //[3] Getting comments 
            httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}/{vehiclePurchaseId}/comments");
            var vehiclePurchasesComments = await GetResponseContent<List<VehiclePurchaseComment>>(httpResponse);
            vehiclePurchasesComments[0].Body.Should().Be(commentItem.Body);
            vehiclePurchasesComments[0].Title.Should().Be(commentItem.Title);
        }

        /*
         * 
        [Fact(DisplayName = "Test Vehicle Purchase Order CRUD (Create, Get by Id, Update, Get paginated list, delete)")]
        public async Task ShouldCreateVehiclePurchase()
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
                ChassisNumber = "WX254747YL" + new Random().Next(10, 99),
                Mileage = 160000,
                ReleaseDate = DateTime.Now.AddYears(-2),
                RegistrationType = VehicleRegistrationType.Local,
                DesiredVehicleCondition = DesiredVehicleCondition.New,
                DesiredVehicleBrand = "Ford",
                DesiredVehicleModel = "Focus"
            };

            //[1] create
            await TryAdd(newItem);

            //[2] get by id
            var addedItem = await TryGetById(newItem.Id.ToString());
            addedItem.Should().NotBeNull();
            addedItem.Customer.Email.Should().Be(newItem.Email);
            addedItem.DisposedVehicle.ChassisNumber.Should().Be(newItem.ChassisNumber);

            //[3] update
            newItem.Phone = "0615236700";
            await TryUpdate(newItem.Id, newItem);

            //[4] get by id
            var updatedItem = await TryGetById(newItem.Id.ToString());
            updatedItem.Should().NotBeNull();
            updatedItem.Customer.Phone.Should().Be(newItem.Email);

            //[5] get paginated list
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page=1&size=2");
            httpResponse.EnsureSuccessStatusCode();
            var pagedResult = await GetResponsePagedListContent(httpResponse);
            pagedResult.Results.Count.Should().Be(1);
            pagedResult.PageCount.Should().Be(1);

            //[6] delete
            await TryDelete(updatedItem.Id);
            await TryGetById(updatedItem.Id.ToString(), System.Net.HttpStatusCode.NotFound);
        }
        */

        protected override string GetRequestUri()
        {
            return "/api/VehiclePurchases";
        }
    }
}