// File: CaseManagement.Application/Clients/Dtos/CreateClientRequest.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Application.Clients.Dtos;

public sealed class CreateClientRequest
{
    public string FullName { get; init; } = string.Empty;
    public string NationalCode { get; init; } = string.Empty;
    public string? Mobile { get; init; }
    public string? Phone { get; init; }
    public string? Address { get; init; }
    public string? Description { get; init; }
}
