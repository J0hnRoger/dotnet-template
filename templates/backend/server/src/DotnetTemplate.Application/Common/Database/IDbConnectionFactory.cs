using System.Data;

namespace DotnetTemplate.Application.Common.Database;

public interface IDbConnectionFactory
{
    IDbConnection GetOpenConnection();
}
