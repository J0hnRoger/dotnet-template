# DotNet Project

## Stack
- .Net Core 8

## Core Features 

1. Logging/Observability - AppInsights 
2. Quotas - native
3. Minimal API Endpoints - native
4. Global Error Handling - middleware native
5. Configuration - User Secrets + Azure KeyVault
6. Mapping DTO - Automapper
7. Discoverability / API Documentation - Swagger/Open API
8. Health Checks - native - middleware pour insérer des checks de dépendances externes (API/DB)
9. Tests - xUnit / FluentAssertions / TestConfiguration + Integration WebApplicationFactory
10. Load Testing - Benchmark.Net
11. Validation - FluentValidation
12. Resilience - Polly
13. (optional) Feature Flag - Azure App Configuration
14. (option) Authentication - Azure AD
15. (option) Cache server - Azure Cosmos DB / SQL Server pour du cache distribué
16. (option) Versioning - native
17. (option) Persistence - EF Core 8
18. (option) Containerization - Docker / docker-compose
 
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
