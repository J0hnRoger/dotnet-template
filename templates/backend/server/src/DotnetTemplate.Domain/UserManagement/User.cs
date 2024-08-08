using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Domain.UserManagement;

public class User : Entity
{
    private User(Guid id, Email email, Name name)
        : base(id)
    {
        Email = email;
        Name = name;
    }

    private User()
    {
    }

    public Email Email { get; private set; }

    public Name Name { get; private set; }


    public static User Create(Email email, Name name)
    {
        var user = new User(Guid.NewGuid(), email, name);

        user.Raise(new UserCreatedDomainEvent(user.Id));

        return user;
    }
}