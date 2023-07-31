using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class adding_phone_represetants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SISALCommercialPhone",
                table: "Retailers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SISALCommercialPhone",
                table: "Retailers");
        }
    }
}
