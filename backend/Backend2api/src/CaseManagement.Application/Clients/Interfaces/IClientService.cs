// File: CaseManagement.Application/Clients/Interfaces/IClientService.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Application.Clients.Dtos;
using CaseManagement.Shared.Contracts;

namespace CaseManagement.Application.Clients.Interfaces;

public interface IClientService
{
    Task<PagedResponse<ClientListItemDto>> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        CancellationToken cancellationToken = default);

    Task<ClientDto> CreateAsync(
        CreateClientRequest request,
        CancellationToken cancellationToken = default);

    Task<ClientDto> UpdateAsync(
        Guid id,
        UpdateClientRequest request,
        CancellationToken cancellationToken = default);
}
