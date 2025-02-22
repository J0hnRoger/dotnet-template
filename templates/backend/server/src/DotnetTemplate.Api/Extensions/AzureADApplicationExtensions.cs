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
            options.Events = new OpenIdConnectEvents {OnTokenValidated = OnAzureAdTokenValidatedAsync};
        });

        return builder;
    }

    /// <summary>
    /// Méthode de mapping entre l'identité externe et l'aspnetUser une fois le token validé par Azure AD.
    /// </summary>
    private static async Task OnAzureAdTokenValidatedAsync(TokenValidatedContext context)
    {
        if (context.Principal?.Identity is not ClaimsIdentity azureAdIdentity)
            throw new Exception("User not authenticated");

        var userManager = context.HttpContext.RequestServices
            .GetRequiredService<UserManager<ApplicationUser>>();
        var signInManager = context.HttpContext.RequestServices
            .GetRequiredService<SignInManager<ApplicationUser>>();

        // Récupération des informations Azure AD
        var externalUserId = azureAdIdentity.FindFirst(ClaimConstants.Oid);
        var email = azureAdIdentity.FindFirst("upn") ??
                    azureAdIdentity.FindFirst("unique_name");

        if (email == null || externalUserId == null)
            throw new Exception("Impossible de récupérer les informations de l'utilisateur depuis Azure AD.");

        var user = await userManager.FindByEmailAsync(email.Value);

        if (user == null)
        {
            context.Response.Redirect("/error?msg=NoUser");
            context.HandleResponse();
            return;
        }

        // Mise à jour des informations utilisateur si nécessaire
        if (MapUserInfo(user, azureAdIdentity))
            await userManager.UpdateAsync(user);

        // Gestion du login externe
        await EnsureExternalLoginAsync(user, externalUserId.Value, userManager, context);

        // Création d'une nouvelle identité basée uniquement sur ASP.NET Identity
        var userPrincipal = await signInManager.CreateUserPrincipalAsync(user);

        // Remplacer l'identité Azure AD par celle d'ASP.NET Identity
        context.Principal = userPrincipal;

        await signInManager.SignInAsync(user, isPersistent: false);
    }

    private static bool MapUserInfo(ApplicationUser user, ClaimsIdentity azureAdIdentity)
    {
        bool shouldUpdate = false;

        string? givenName = azureAdIdentity.FindFirst("given_name")?.Value;
        string? familyName = azureAdIdentity.FindFirst("family_name")?.Value;

        if (String.IsNullOrEmpty(user.FirstName))
        {
            user.FirstName = givenName;
            shouldUpdate = true;
        }

        if (String.IsNullOrEmpty(user.LastName))
        {
            user.LastName = familyName;
            shouldUpdate = true;
        }

        return shouldUpdate;
    }

    private static async Task EnsureExternalLoginAsync(ApplicationUser user, string externalUserId,
        UserManager<ApplicationUser> userManager, TokenValidatedContext context)
    {
        var userLogins = await userManager.GetLoginsAsync(user);
        var hasExternalLogin = userLogins.Any(x =>
            x.ProviderKey == externalUserId && x.LoginProvider == "AzureAD");

        if (!hasExternalLogin)
        {
            var info = new UserLoginInfo("AzureAD", externalUserId, "Azure Active Directory");
            var result = await userManager.AddLoginAsync(user, info);
            if (!result.Succeeded)
            {
                context.Response.Redirect("/error?msg=ExternalProviderError");
                context.HandleResponse();
            }
        }
    }
}