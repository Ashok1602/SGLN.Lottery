using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class Request_Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestNatureInCharge",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "ProcessingDirection",
                table: "Requests",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProcessingDirection",
                table: "RequestObjects",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Administration",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProcessingDirection",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "ProcessingDirection",
                table: "RequestObjects");

            migrationBuilder.DropColumn(
                name: "Administration",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "RequestNatureInCharge",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }
    }
}
