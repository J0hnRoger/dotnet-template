using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace DotnetTemplate.Api.Health;

public class DatabaseHealthCheck : IHealthCheck
{
    // private readonly ReadOnlyDeliveryContext _deliveryContext;

    public DatabaseHealthCheck()
    {
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context,
        CancellationToken cancellationToken = new CancellationToken())
    {
        try
        {
            // var canConnect = await _deliveryContext.Database.CanConnectAsync(cancellationToken);
            // if (!canConnect)
              //  return HealthCheckResult.Unhealthy($"Database offline: Delivery");
            
            return HealthCheckResult.Healthy();
        }
        catch (Exception e)
        {
            return HealthCheckResult.Unhealthy(exception: e);
        }
    }
}
