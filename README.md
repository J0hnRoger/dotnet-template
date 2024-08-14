# dotnet-template

Templates for my API/SPA/Blazor projects

# Getting Start

## Prerequisites

- .Net 8 SDK
- Node.js (for Front Project in ViteJS with React/TS)
 
## Development

- Pour mettre à jour localement le template, lancer le script PowerShell à la racine :
```
><path>/dotnet-templates/ ./.scripts/publish.ps1
```
 
## Usage

- Installer le template locallement à partir de NuGet:
`dotnet new install DotNet.Template.Solution.Template::8.0.5`

- Template for API: 
` dotnet new bmm-api -V Core -o YourProjectName`

- Template for React SPA:
`dotnet new bmm-react -o YourProjectName`

# Deployment
- La stack Core n'inclue pas de mode de déploiement (si ce n'est Docker)
- La stack PaaS utilise les services Azure
 
## Core Features

> `dotnet new bmm-api -o YourProjectName`
 
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
13. (option) CQRS - Dapper
13. (option) User Authentication - AspNetUser Core Identity
14. (option) Persistence - EF Core 8 - SQLite | SQL Server
16. (option) Infrastructure Authorization - MS Entra Azure AD Application
17. (option) Versioning - native

## Azure Features 

> `dotnet new bmm-api -V PaaS -o YourProjectName`
 
13. Logging/Observability - AppInsights
14. (optional) Feature Flag - Azure App Configuration
15. (option) User Authentication - OAuth2 via Azure AD Account | JWT/OpenID Server (Identity Server)
16. (option) Application Authentication - MS Entra Azure AD Application
16. (option) Cache server - Azure Cosmos DB / SQL Server pour du cache distribué

# Licence
This project is under MIT Licence
