using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ACG.SGLN.Lottery.Infrastructure.Migrations
{
    public partial class UserAndNotification_Update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Retailers_Notifications_NotificationId",
                table: "Retailers");

            migrationBuilder.DropIndex(
                name: "IX_Retailers_NotificationId",
                table: "Retailers");

            migrationBuilder.DropColumn(
                name: "NotificationId",
                table: "Retailers");

            migrationBuilder.CreateTable(
                name: "RetailerNotifications",
                columns: table => new
                {
                    RetailerId = table.Column<Guid>(nullable: false),
                    NotificationId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetailerNotifications", x => new { x.RetailerId, x.NotificationId });
                    table.ForeignKey(
                        name: "FK_RetailerNotifications_Notifications_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RetailerNotifications_Retailers_RetailerId",
                        column: x => x.RetailerId,
                        principalTable: "Retailers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RetailerNotifications_NotificationId",
                table: "RetailerNotifications",
                column: "NotificationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RetailerNotifications");

            migrationBuilder.AddColumn<Guid>(
                name: "NotificationId",
                table: "Retailers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Retailers_NotificationId",
                table: "Retailers",
                column: "NotificationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Retailers_Notifications_NotificationId",
                table: "Retailers",
                column: "NotificationId",
                principalTable: "Notifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
