using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class UerTokens_Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "AspNetUserTokens",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "AspNetUserTokens",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModified",
                table: "AspNetUserTokens",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedBy",
                table: "AspNetUserTokens",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Created",
                table: "AspNetUserTokens");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "AspNetUserTokens");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "AspNetUserTokens");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "AspNetUserTokens");
        }
    }
}
