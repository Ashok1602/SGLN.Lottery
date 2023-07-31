using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class Retailers_Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdministrativeRegion",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CommercialZone",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GPSCoordinates",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GeoCodeHCP",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Municipality",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfessionalTax",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SGLNCommercialName",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SGLNCommercialPhone",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TradeRegister",
                table: "Retailers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdministrativeRegion",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "CommercialZone",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "GPSCoordinates",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "GeoCodeHCP",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "Municipality",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "ProfessionalTax",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "SGLNCommercialName",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "SGLNCommercialPhone",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "TradeRegister",
                table: "Retailers");
        }
    }
}
