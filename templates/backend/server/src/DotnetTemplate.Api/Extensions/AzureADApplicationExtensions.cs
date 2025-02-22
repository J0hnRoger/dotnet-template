using System.Security.Claims;
using DotnetTemplate.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Identity;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;

namespace DotnetTemplate.Api.Extensions;

/// <summary>
/// Authentifier l'API via Microsoft Entra
/// - permet de protéger les endpoints de l'API
/// </summary>
public static class AzureAdApplicationExtensions
{
    public static AuthenticationBuilder AddEntraAppAuthentication(this AuthenticationBuilder builder,
        ConfigurationManager builderConfiguration)
    {
        // On ajoute seulement l’OpenIdConnect
        builder.AddOpenIdConnect("AzureAD", options =>
        {
            options.MapInboundClaims = false;

            options.ClientId = builderConfiguration["AzureAd:ClientId"];
            options.Authority =
                $"{builderConfiguration["AzureAd:Instance"]}{builderConfiguration["AzureAd:TenantId"]}";
            options.CallbackPath = builderConfiguration["AzureAd:CallbackPath"];
            options.ClientSecret = builderConfiguration["AzureAd:ClientSecret"];
            options.ResponseType = "code";
            options.SaveTokens = true;

            options.Scope.Add("email");
            options.Scope.Add("openid");
            options.Scope.Add("profile");

            // Paramètres de validation
            options.TokenValidationParameters = new TokenValidationParameters {ValidateIssuer = true};

            // Gestion des événements
            options.Events = new OpenIdConnectEvents { OnTokenValidated = OnAzureAdTokenValidatedAsync};
        });

        return builder;
    }

    /// <summary>
    /// Méthode de mapping entre l'identité externe et l'aspnetUser une fois le token validé par Azure AD.
    /// </summary>
    private static async Task OnAzureAdTokenValidatedAsync(TokenValidatedContext context)
    {
        if (context.Principal?.Identity is not ClaimsIdentity claimsIdentity)
            throw new Exception("User not authenticated");

        var userManager = context.HttpContext.RequestServices
            .GetRequiredService<UserManager<ApplicationUser>>();
        var signInManager = context.HttpContext.RequestServices
            .GetRequiredService<SignInManager<ApplicationUser>>();

        // Identifiant unique Azure AD
        var externalUserId = claimsIdentity.FindFirst(ClaimConstants.Oid);
        // On utilise l'UPN pour lier l'identité externe à l'utilisateur AspNetIdentity
        var email = claimsIdentity.FindFirst("upn") ??
                    claimsIdentity.FindFirst("unique_name");

        if (email == null || externalUserId == null)
            throw new Exception("Impossible de récupérer les informations de l'utilisateur depuis Azure AD.");

        var user = await userManager.FindByEmailAsync(email.Value);
        if (user == null)
        {
            context.Response.Redirect("/error?msg=NoUser");
            context.HandleResponse();
            return;
        }

        var userLogins = await userManager.GetLoginsAsync(user);
        var hasExternalLogin = userLogins.Any(x =>
            x.ProviderKey == externalUserId.Value && x.LoginProvider == "AzureAD");

        if (!hasExternalLogin)
        {
            // Si aucun login externe n'existe pour cet utilisateur, on l'ajoute
            var info = new UserLoginInfo("AzureAD", externalUserId.Value, "Azure Active Directory");
            var result = await userManager.AddLoginAsync(user, info);
            if (!result.Succeeded)
            {
                context.Response.Redirect("/error?msg=ExternalProviderError");
                context.HandleResponse();
            }
        }

        // Ajout manuel du Claim NameIdentifier pour lier l'user local
        claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));

        await signInManager.SignInAsync(user, isPersistent: false);
    }
}