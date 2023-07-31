using ACG.SGLN.Lottery.Application.VehiclePurchases;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using System;
using System.Threading.Tasks;
using Xunit;

namespace ACG.SGLN.Lottery.WebApi.Mobile.IntegrationTests.ControllerTests
{
    public class VehiclePurchasesControllerTests : BaseControllerTests<VehiclePurchase, VehiclePurchaseDto
        , VehiclePurchasesVm>
    {
        public VehiclePurchasesControllerTests(CustomWebApplicationFactory<Startup> factory) : base(factory)
        {
        }

        [Fact(DisplayName = "Test Create Vehicle Purchase Order ")]
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
                //ChassisNumber = "WX254747YL" + new Random().Next(10, 99),
                Mileage = 160000,
                ReleaseDate = DateTime.Now.AddYears(-2),
                RegistrationType = VehicleRegistrationType.Local,
                DesiredVehicleCondition = VehicleCondition.New,
                DesiredVehicleBrand = "Ford",
                DesiredVehicleModel = "Focus"
            };

            //[1] create
            await TryAdd(newItem);
        }

        protected override string GetRequestUri()
        {
            return "/api/VehiclePurchases";
        }
    }
}