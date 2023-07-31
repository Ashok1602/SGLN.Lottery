using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class Retailers_Update2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SISALCommercialName",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxIdentification",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WeeksNumber",
                table: "Retailers",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SISALCommercialName",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "TaxIdentification",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "WeeksNumber",
                table: "Retailers");
        }
    }
}
