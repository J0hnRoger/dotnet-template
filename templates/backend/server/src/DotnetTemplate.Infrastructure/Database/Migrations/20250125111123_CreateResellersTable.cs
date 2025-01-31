using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoostMyMail.ResellersBackOffice.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreateResellersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Resellers",
                table: "Resellers");

            migrationBuilder.RenameTable(
                name: "Resellers",
                newName: "resellers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_resellers",
                table: "resellers",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_resellers",
                table: "resellers");

            migrationBuilder.RenameTable(
                name: "resellers",
                newName: "Resellers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Resellers",
                table: "Resellers",
                column: "Id");
        }
    }
}
