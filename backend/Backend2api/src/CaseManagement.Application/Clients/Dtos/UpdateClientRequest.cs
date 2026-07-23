// File: CaseManagement.Application/Clients/Dtos/UpdateClientRequest.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Application.Clients.Dtos;

public sealed class UpdateClientRequest
{
    public string? FullName { get; init; }
    public string? NationalCode { get; init; }
    public string? Mobile { get; init; }
    public string? Phone { get; init; }
    public string? Address { get; init; }
    public string? Description { get; init; }
}
