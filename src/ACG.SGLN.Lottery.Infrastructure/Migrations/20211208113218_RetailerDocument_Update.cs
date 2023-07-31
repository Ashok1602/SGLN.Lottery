using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class RetailerDocument_Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "RetailerDocuments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "RetailerDocuments");
        }
    }
}
