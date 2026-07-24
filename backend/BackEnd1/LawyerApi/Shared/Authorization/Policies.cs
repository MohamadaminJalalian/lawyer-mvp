namespace LawyerApi.Shared.Authorization;

public static class Policies
{
    public const string AdminOnly = "AdminOnly";
    public const string StaffOnly = "StaffOnly";
    public const string AdminOrStaff = "AdminOrStaff";
}