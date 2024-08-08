namespace Application.Users;

public static class BudgetManagementErrorCodes
{
    public static class CreateTransaction
    {
        public const string MissingName = nameof(MissingName);
        public const string MissingAmount = nameof(MissingAmount);
        public const string MissingEmail = nameof(MissingEmail);
    }
}
