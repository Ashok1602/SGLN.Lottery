using ACG.SGLN.Lottery.Application.TechnicalExpertises;
using ACG.SGLN.Lottery.Application.VehiclePurchases;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using FluentAssertions;
using System;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebUI.BO.IntegrationTests.ControllerTests
{
    public class TechnicalExpertisesControllerTests : BaseControllerTests<TechnicalExpertise, TechnicalExpertiseDto
        , TechnicalExpertisesVm>
    {
        public TechnicalExpertisesControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }

        private async Task CreateVehiclePurchasesForTechnicalExpertises()
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
            var httpResponse = await HttpClient.PostAsync(GetVehiclePurchaseRequestUri(), CreatePostBody(newItem2));
            var veh1 = await GetResponseContent<VehiclePurchase>(httpResponse);
            httpResponse = await HttpClient.PostAsync(GetVehiclePurchaseRequestUri(), CreatePostBody(newItem));
            var veh2 = await GetResponseContent<VehiclePurchase>(httpResponse);

            await HttpClient.PostAsync($"{GetVehiclePurchaseRequestUri()}/{veh1.Id}/technicalExpertises", null);
            await HttpClient.PostAsync($"{GetVehiclePurchaseRequestUri()}/{veh2.Id}/technicalExpertises", null);
        }

        [Fact(DisplayName = "Test Technical Expertises (Listing Paginated - Get by id - Vehicle Check Part Quotation Update - Copy)")]
        public async Task ShouldCreateListGetCopyTechnicalExpertise()
        {
            await CreateVehiclePurchasesForTechnicalExpertises();

            int page = 1, size = 1;
            //[1] Getting Technical Expertises Listing Paginated
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page={page}&size={size}");
            httpResponse.EnsureSuccessStatusCode();

            var pagedResult = await GetResponsePagedListContent(httpResponse);
            pagedResult.Results.Count.Should().Be(1);
            pagedResult.PageCount.Should().Be(2);

            var technicalExpertiseId = pagedResult.Results[0].Id;

            //[2] Get Technical Expertise by Id 
            var technicalExpertise = await TryGetById(technicalExpertiseId.ToString());
            httpResponse.EnsureSuccessStatusCode();

            technicalExpertise.Should().NotBeNull();

            //[3] Technical Expertise Copy
            httpResponse = await HttpClient.PostAsync($"{GetRequestUri()}/{technicalExpertise.Id}/copy", null);
            var technicalExpertiseCopy = await GetResponseContent(httpResponse);
            httpResponse.EnsureSuccessStatusCode();
            technicalExpertiseCopy.LastStatus.Should().Be(technicalExpertise.LastStatus);
            technicalExpertiseCopy.Quotation.Should().Be(technicalExpertise.Quotation);
        }

        [Fact(DisplayName = "Test Technical Expertises (Vehicle Check Part Quotation Update - Listing checkParts)")]
        public async Task ShouldValidateTechnicalExpertiseWorkflow()
        {
            await CreateVehiclePurchasesForTechnicalExpertises();
            //[1] Getting Technical Expertises Listing Paginated
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page=1&size=1");
            var pagedResult = await GetResponsePagedListContent(httpResponse);

            var technicalExpertiseId = pagedResult.Results[0].Id;

            //[2] Get Technical Expertise by Id 
            var technicalExpertise = await TryGetById(technicalExpertiseId.ToString());

            //[3] Update a check part quotation
            var updateCheckPartQuotationDto = new VehicleCheckPartQuotationDto
            {
                Quantity = 2,
                Cost = 100,
                Action = VehicleCheckPartAction.Repair,
                Comment = "Defaulted"
            };
            httpResponse = await HttpClient.PutAsync($"{GetVehicleCheckPartQuotationRequestUri()}/{technicalExpertise.CheckPartQuotations[0].Id}", CreatePostBody(updateCheckPartQuotationDto));
            httpResponse.EnsureSuccessStatusCode();
            technicalExpertise = await TryGetById(technicalExpertiseId.ToString());

            technicalExpertise.CheckPartQuotations[0].Cost.Should().Be(updateCheckPartQuotationDto.Cost);

            //[4] Getting Technical Expertises CheckParts
            httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}/{technicalExpertise.Id}/checkparts?page=1&size=1");
            pagedResult = await GetResponsePagedListContent(httpResponse);
            httpResponse.EnsureSuccessStatusCode();

            pagedResult.Results.Count.Should().Be(1);

            //[4] Submit Technical Expertise
            httpResponse = await HttpClient.PostAsync($"{GetRequestUri()}/{technicalExpertise.Id}/submit", null);
            httpResponse.EnsureSuccessStatusCode();

            //[5] Update Technical Expertise quotation
            var updateTechnicalExpertiseQuotationDto = new TechnicalExpertiseDto
            {
                Quotation = 10000
            };
            httpResponse = await HttpClient.PutAsync($"{GetRequestUri()}/{technicalExpertise.Id}/quotation", CreatePostBody(updateTechnicalExpertiseQuotationDto));
            httpResponse.EnsureSuccessStatusCode();
            technicalExpertise = await TryGetById(technicalExpertiseId.ToString());
            technicalExpertise.Quotation.Should().Be(updateTechnicalExpertiseQuotationDto.Quotation);

            //[4] Submit Technical Expertise quotation
            updateTechnicalExpertiseQuotationDto.Quotation = 11000;
            httpResponse = await HttpClient.PostAsync($"{GetRequestUri()}/{technicalExpertise.Id}/quotation/submit", null);
            httpResponse.EnsureSuccessStatusCode();
            technicalExpertise = await TryGetById(technicalExpertiseId.ToString());
            technicalExpertise.Quotation.Should().Be(updateTechnicalExpertiseQuotationDto.Quotation);

            //[5] Validate Technical Expertise quotation
            var technicalExpertiseQuotationValidationDto = new TechnicalExpertiseQuotationValidationDto
            {
                Quotation = 12000,
                Validated = true
            };
            httpResponse = await HttpClient.PutAsync($"{GetRequestUri()}/{technicalExpertise.Id}/quotation/validate", CreatePostBody(technicalExpertiseQuotationValidationDto));
            httpResponse.EnsureSuccessStatusCode();
            technicalExpertise = await TryGetById(technicalExpertiseId.ToString());
            technicalExpertise.Quotation.Should().Be(technicalExpertiseQuotationValidationDto.Quotation);
            technicalExpertise.LastStatus.Should().Be(TechnicalExpertiseStatusType.QuotationAccepted);
        }
        /*
        [Fact(DisplayName = "Test Technical Expertise Get by Id")]
        public async Task ShouldGetTechnicalExpertiseById()
        {
            //[1] Getting Technical Expertises
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page=1&size=1");
            httpResponse.EnsureSuccessStatusCode();

            //[2] Get Id of one Technical Expertise
            var technicalExpertiseId = (await GetResponsePagedListContent(httpResponse)).Results[0].Id;

            //[2] Get Technical Expertise by Id 
            var technicalExpertise = await TryGetById(technicalExpertiseId.ToString());
            httpResponse.EnsureSuccessStatusCode();

            technicalExpertise.Should().NotBeNull();
        }

        [Fact(DisplayName = "Test Technical Expertise Copy")]
        public async Task ShouldCopyTechnicalExpertise()
        {
            //[1] Getting Technical Expertises
            var httpResponse = await HttpClient.GetAsync($"{GetRequestUri()}?page=1&size=1");
            httpResponse.EnsureSuccessStatusCode();

            //[2] Get Id of one Technical Expertise
            var technicalExpertise = (await GetResponsePagedListContent(httpResponse)).Results[0];

            //[2] Copy Technical Expertise 
            httpResponse = await HttpClient.PostAsync($"{GetRequestUri()}/{technicalExpertise.Id}/copy",null);
            var technicalExpertiseCopy = await GetResponseContent(httpResponse);
            httpResponse.EnsureSuccessStatusCode();

            technicalExpertiseCopy.Reference.Should().Be(technicalExpertise.Reference);
            technicalExpertiseCopy.Quotation.Should().Be(technicalExpertise.Quotation);
        }
        */
        protected override string GetRequestUri()
        {
            return "/api/TechnicalExpertises";
        }
        protected string GetVehiclePurchaseRequestUri()
        {
            return "/api/VehiclePurchases";
        }
        protected string GetVehicleCheckPartQuotationRequestUri()
        {
            return "/api/VehiclePurchases";
        }
    }
}