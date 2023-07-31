using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class _003_notifications_target : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TargetId",
                table: "Notifications",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TargetScreen",
                table: "Notifications",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "TargetScreen",
                table: "Notifications");
        }
    }
}
