using Azure.Identity;

namespace DotnetTemplate.Api.Extensions;

public static class KeyVaultIfExistsExtensions
{
    public static IServiceCollection AddKeyVaultIfConfigured(this IServiceCollection services,
        ConfigurationManager configuration, IWebHostEnvironment env)
    {
        var keyVaultUri = configuration["KeyVaultUri"];
        if (!string.IsNullOrWhiteSpace(keyVaultUri))
        {
            configuration.AddAzureKeyVault(
                new Uri(keyVaultUri),
                new DefaultAzureCredential());
        }

        configuration.AddEnvironmentVariables();
        
        // if (env.IsDevelopment())
        configuration.AddUserSecrets<Program>();

        return services;
    }
}