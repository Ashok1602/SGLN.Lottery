using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class _005_request_categories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestCategory",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "RequestCategory",
                table: "RequestObjects");

            migrationBuilder.AddColumn<Guid>(
                name: "RequestCategoryId",
                table: "Requests",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "RequestCategoryId",
                table: "RequestObjects",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "RequestCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    LastModified = table.Column<DateTime>(nullable: true),
                    CreatedBy = table.Column<string>(nullable: true),
                    LastModifiedBy = table.Column<string>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: true),
                    Uri = table.Column<string>(nullable: true),
                    Data = table.Column<byte[]>(nullable: true),
                    MimeType = table.Column<string>(nullable: true),
                    IsGenerated = table.Column<bool>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Spec = table.Column<int>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    IsDeactivated = table.Column<bool>(nullable: false),
                    RequestNature = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestCategories", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RequestObjects_RequestCategoryId",
                table: "RequestObjects",
                column: "RequestCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_RequestObjects_RequestCategories_RequestCategoryId",
                table: "RequestObjects",
                column: "RequestCategoryId",
                principalTable: "RequestCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RequestObjects_RequestCategories_RequestCategoryId",
                table: "RequestObjects");

            migrationBuilder.DropTable(
                name: "RequestCategories");

            migrationBuilder.DropIndex(
                name: "IX_RequestObjects_RequestCategoryId",
                table: "RequestObjects");

            migrationBuilder.DropColumn(
                name: "RequestCategoryId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "RequestCategoryId",
                table: "RequestObjects");

            migrationBuilder.AddColumn<int>(
                name: "RequestCategory",
                table: "Requests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RequestCategory",
                table: "RequestObjects",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
