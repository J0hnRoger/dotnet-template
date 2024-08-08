using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DotnetTemplate.Infrastructure.Identity;

public class IdentityContext : IdentityDbContext<ApplicationUser>
{
  public IdentityContext(DbContextOptions<IdentityContext> options)
         : base(options) {}   
}