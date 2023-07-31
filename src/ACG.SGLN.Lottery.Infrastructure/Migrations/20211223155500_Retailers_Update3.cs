using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class Retailers_Update3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Classification",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoyalityPoints",
                table: "Retailers",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Classification",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "LoyalityPoints",
                table: "Retailers");
        }
    }
}
