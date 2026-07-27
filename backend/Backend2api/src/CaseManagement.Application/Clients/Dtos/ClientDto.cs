// File: CaseManagement.Application/Clients/Dtos/ClientDto.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Application.Clients.Dtos;

public sealed class ClientDto
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string NationalCode { get; init; } = string.Empty;
    public string? Mobile { get; init; }
    public string? Phone { get; init; }
    public string? Address { get; init; }
    public string? Description { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}
