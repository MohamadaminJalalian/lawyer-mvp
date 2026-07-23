// File: CaseManagement.Application/Clients/Dtos/ClientListItemDto.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Application.Clients.Dtos;

public sealed class ClientListItemDto
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string NationalCode { get; init; } = string.Empty;
    public string? Mobile { get; init; }
    public string? Phone { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
}
