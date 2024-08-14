using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Application.Common.Messaging;

public interface IQuery<TResponse> : IRequest<Result<TResponse>>
{
}
