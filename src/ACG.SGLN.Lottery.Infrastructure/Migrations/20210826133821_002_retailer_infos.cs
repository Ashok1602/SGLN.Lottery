using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class _002_retailer_infos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AdressLatitude",
                table: "Retailers",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "AdressLongitude",
                table: "Retailers",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "CurrentBalance",
                table: "Retailers",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdressLatitude",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "AdressLongitude",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "CurrentBalance",
                table: "Retailers");
        }
    }
}
