using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace DotnetTemplate.Web.Api.Health;

public class DeliveryDatabaseHealthCheck : IHealthCheck
{
    // private readonly ReadOnlyDeliveryContext _deliveryContext;

    public DeliveryDatabaseHealthCheck()
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
