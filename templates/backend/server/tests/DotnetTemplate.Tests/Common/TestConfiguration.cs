using Microsoft.Extensions.Configuration;

namespace DotnetTemplate.Tests.Common;

/// <summary>
/// Méthodes d'accès aux secrets du projet de test 
/// </summary>
public class TestConfiguration
{
    /// <summary>
    /// Retourne la valeur `string` d'une section de la configuration
    /// </summary>
    public static string? GetSecretValue(string sectionName)
    {
        var iConfig = GetIConfigurationRoot();
        return iConfig
            .GetSection(sectionName)
            .Value;
    }

    /// <summary>
    /// Shortcut pour récupérer des connectinoStrings de la section `ConnectionStrings`
    /// </summary>
    /// <param name="connectionString"></param>
    /// <returns></returns>
    public static string GetDbConnectionString(string connectionString = "DefaultConnection")
    {
        var iConfig = GetIConfigurationRoot();
        return iConfig.GetConnectionString(connectionString);
    }

    /// <summary>
    /// Retourne l'instance passée en paramètre bindée sur la section de la configuration
    /// </summary>
    /// <typeparam name="T">Class d'options mappée sur la section</typeparam>
    /// <param name="sectionName">Nom de la section</param>
    public static T GetApplicationConfiguration<T>(string sectionName) where T : new()
    {
        var iConfig = GetIConfigurationRoot();
        var configuration = new T();

        iConfig
            .GetSection(sectionName)
            .Bind(configuration);

        return configuration;
    }

    private static IConfigurationRoot GetIConfigurationRoot()
    {
        var config = new ConfigurationBuilder();
        return config
            .AddUserSecrets<TestConfiguration>()
            .Build();
    }
}