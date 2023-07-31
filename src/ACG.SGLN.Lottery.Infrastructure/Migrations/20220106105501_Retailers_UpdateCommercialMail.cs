using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class Retailers_UpdateCommercialMail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SGLNCommercialMail",
                table: "Retailers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SISALCommercialMail",
                table: "Retailers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SGLNCommercialMail",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "SISALCommercialMail",
                table: "Retailers");
        }
    }
}
