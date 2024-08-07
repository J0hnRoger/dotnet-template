# DotNet Project

## Stack
- .Net Core 8

## Full Features 

<!--#if (Variant == 'Core') -->
## Template: Core 
> Le template Core permet d'initialiser une API en facilitant et encourageant l'application des bonnes pratiques de développement
 
usage: 
`
dotnet new bmm-api
`
<!--#else -->
## Template: AzurePaaS
> Le template PaaS permet d'initialiser les configurations des services PaaS Azure nécessaires pour supporter les fonctionnalités avancées d'une application web

usage:
`
dotnet new bmm-api
`
<!--#endif -->

### Core Features

1. Minimal API Endpoints - native
2. Quotas - native
3. Clean Architecture structure - native
4. Global Error Handling - middleware native
5. Configuration - AppSettings.json + User Secrets
6. Mapping DTO - Automapper
7. Discoverability / API Documentation - Swagger/Open API
8. Health Checks - native - middleware pour insérer des checks de dépendances externes (API/DB)
9. Tests - xUnit / FluentAssertions / TestConfiguration + Integration WebApplicationFactory
11. Validation - FluentValidation
12. Resilience - Polly
13. (option) User Authentication - AspNetUser Core Identity
14. (option) Persistence - EF Core 8 - SQLite | SQL Server
16. (option) Infrastructure Authorization - MS Entra Azure AD Application
17. (option) Versioning - native

<!--#if (Variant == 'PaaS') -->
## Features Azure

13. Logging/Observability - AppInsights
14. (optional) Feature Flag - Azure App Configuration
15. (option) User Authentication - OAuth2 via Azure AD Account | JWT/OpenID Server (Identity Server)
16. (option) Application Authentication - MS Entra Azure AD Application
16. (option) Cache server - Azure Cosmos DB / SQL Server pour du cache distribué

<!--#endif-->
### Tooling  
. Linter - SonarQube 
 
## Bonus 
 
## Next
. Utilisation de fichier Bicep pour générer les ressources Azure nécessaires : OAuth Azure AD App, Azure KeyVault reference, AppInsight 
. Load Testing - Benchmark.Net
. .Net Aspire: dashboard de suivi
.  Containerization - Docker / docker-compose

## Build

Run `dotnet build` to build the solution.

## Run

To run the web application:

```bash
dotnet watch run -tl
```

Navigate to https://localhost:5001. The application will automatically reload if you change any of the source files.

## Code Styles & Formatting

The template includes [EditorConfig](https://editorconfig.org/) support to help maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. The **.editorconfig** file defines the coding styles applicable to this solution.

## Test

<!--#if (UseApiOnly) -->
The solution contains unit, integration, and functional tests.

To run the tests:
```bash
dotnet test
```
<!--#else -->
The solution contains unit, integration, functional, and acceptance tests.

To run the unit, integration, and functional tests (excluding acceptance tests):
```bash
dotnet test --filter "FullyQualifiedName!~AcceptanceTests"
```

To run the acceptance tests, first start the application:

```bash
cd .\src\Web\
dotnet run
```

Then, in a new console, run the tests:
```bash
cd .\src\Web\
dotnet test
```
<!--#endif -->

## Help
To learn more about the template go to the [project website](caRepositoryUrl). Here you can find additional guidance, request new features, report a bug, and discuss the template with other users.
