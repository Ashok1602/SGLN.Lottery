using Microsoft.EntityFrameworkCore.Migrations;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class _006_reference_column : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Reference",
                table: "Requests",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Requests_RequestCategoryId",
                table: "Requests",
                column: "RequestCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_RequestCategories_RequestCategoryId",
                table: "Requests",
                column: "RequestCategoryId",
                principalTable: "RequestCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_RequestCategories_RequestCategoryId",
                table: "Requests");

            migrationBuilder.DropIndex(
                name: "IX_Requests_RequestCategoryId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "Reference",
                table: "Requests");
        }
    }
}
