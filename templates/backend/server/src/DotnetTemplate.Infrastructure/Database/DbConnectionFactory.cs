using System.Data;
using DotnetTemplate.Application.Common.Database;
using Microsoft.Data.SqlClient;

namespace DotnetTemplate.Infrastructure.Database;

internal sealed class DbConnectionFactory(string connectionString) : IDbConnectionFactory
{
    public IDbConnection GetOpenConnection()
    {
        var connection = new SqlConnection(connectionString);
        connection.Open();
        return connection;
    }
}
