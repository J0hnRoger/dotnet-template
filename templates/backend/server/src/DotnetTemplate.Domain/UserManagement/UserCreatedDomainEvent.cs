using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Domain.UserManagement;

public sealed record UserCreatedDomainEvent(Guid UserId) : IDomainEvent;