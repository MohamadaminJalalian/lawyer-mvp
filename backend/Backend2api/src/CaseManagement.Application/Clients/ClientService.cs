// File: CaseManagement.Application/Clients/ClientService.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Application.Clients.Dtos;
using CaseManagement.Application.Clients.Interfaces;
using CaseManagement.Domain.Entities;
using CaseManagement.Infrastructure.Persistence;
using CaseManagement.Shared.Contracts;
using CaseManagement.Shared.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace CaseManagement.Application.Clients;

public sealed class ClientService : IClientService
{
    private readonly AppDbContext _db;

    public ClientService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<ClientListItemDto>> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        CancellationToken cancellationToken = default)
    {
        if (page <= 0)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["page"] = new[] { "Page must be greater than or equal to 1." }
            });
        }

        if (pageSize <= 0 || pageSize > 200)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["pageSize"] = new[] { "PageSize must be between 1 and 200." }
            });
        }

        IQueryable<Client> query = _db.Clients.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();

            // Minimal, safe search for MVP:
            // search in FullName and NationalCode (and optionally Mobile/Phone)
            query = query.Where(c =>
                c.FullName.Contains(s) ||
                c.NationalCode.Contains(s) ||
                (c.Mobile != null && c.Mobile.Contains(s)) ||
                (c.Phone != null && c.Phone.Contains(s)));
        }

        query = query.OrderByDescending(c => c.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new ClientListItemDto
            {
                Id = c.Id,
                FullName = c.FullName,
                NationalCode = c.NationalCode,
                Mobile = c.Mobile,
                Phone = c.Phone,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new PagedResponse<ClientListItemDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages
        };
    }

    public async Task<ClientDto> CreateAsync(
        CreateClientRequest request,
        CancellationToken cancellationToken = default)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.FullName))
            errors["fullName"] = new[] { "Full name is required." };
        else if (request.FullName.Length > 150)
            errors["fullName"] = new[] { "Full name must be at most 150 characters." };

        if (string.IsNullOrWhiteSpace(request.NationalCode))
            errors["nationalCode"] = new[] { "National code is required." };
        else if (request.NationalCode.Length > 10)
            errors["nationalCode"] = new[] { "National code must be at most 10 characters." };

        if (request.Mobile is { Length: > 20 })
            errors["mobile"] = new[] { "Mobile must be at most 20 characters." };

        if (request.Phone is { Length: > 20 })
            errors["phone"] = new[] { "Phone must be at most 20 characters." };

        if (request.Address is { Length: > 1000 })
            errors["address"] = new[] { "Address must be at most 1000 characters." };

        if (request.Description is { Length: > 1000 })
            errors["description"] = new[] { "Description must be at most 1000 characters." };

        if (errors.Count > 0)
            throw new ValidationException(errors);

        var nationalCode = request.NationalCode.Trim();
        var fullName = request.FullName.Trim();

        var exists = await _db.Clients
            .AsNoTracking()
            .AnyAsync(x => x.NationalCode == nationalCode, cancellationToken);

        if (exists)
        {
            throw new ConflictException(new Dictionary<string, string[]>
            {
                ["nationalCode"] = new[] { "National code already exists." }
            });
        }

        var now = DateTime.UtcNow;

        var entity = new Client
        {
            Id = Guid.NewGuid(),
            FullName = fullName,
            NationalCode = nationalCode,
            Mobile = request.Mobile?.Trim(),
            Phone = request.Phone?.Trim(),
            Address = request.Address?.Trim(),
            Description = request.Description?.Trim(),
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = null
        };

        _db.Clients.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);

        return new ClientDto
        {
            Id = entity.Id,
            FullName = entity.FullName,
            NationalCode = entity.NationalCode,
            Mobile = entity.Mobile,
            Phone = entity.Phone,
            Address = entity.Address,
            Description = entity.Description,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public async Task<ClientDto> UpdateAsync(
        Guid id,
        UpdateClientRequest request,
        CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["id"] = new[] { "Id is invalid." }
            });
        }

        var entity = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
            throw new NotFoundException("Client not found.");

        var errors = new Dictionary<string, string[]>();

        if (request.FullName is not null)
        {
            if (string.IsNullOrWhiteSpace(request.FullName))
                errors["fullName"] = new[] { "Full name cannot be empty." };
            else if (request.FullName.Length > 150)
                errors["fullName"] = new[] { "Full name must be at most 150 characters." };
        }

        if (request.NationalCode is not null)
        {
            if (string.IsNullOrWhiteSpace(request.NationalCode))
                errors["nationalCode"] = new[] { "National code cannot be empty." };
            else if (request.NationalCode.Length > 10)
                errors["nationalCode"] = new[] { "National code must be at most 10 characters." };
        }

        if (request.Mobile is { Length: > 20 })
            errors["mobile"] = new[] { "Mobile must be at most 20 characters." };

        if (request.Phone is { Length: > 20 })
            errors["phone"] = new[] { "Phone must be at most 20 characters." };

        if (request.Address is { Length: > 1000 })
            errors["address"] = new[] { "Address must be at most 1000 characters." };

        if (request.Description is { Length: > 1000 })
            errors["description"] = new[] { "Description must be at most 1000 characters." };

        if (errors.Count > 0)
            throw new ValidationException(errors);

        if (request.NationalCode is not null)
        {
            var newNc = request.NationalCode.Trim();

            var exists = await _db.Clients
                .AsNoTracking()
                .AnyAsync(x => x.NationalCode == newNc && x.Id != id, cancellationToken);

            if (exists)
            {
                throw new ConflictException(new Dictionary<string, string[]>
                {
                    ["nationalCode"] = new[] { "National code already exists." }
                });
            }

            entity.NationalCode = newNc;
        }

        if (request.FullName is not null)
            entity.FullName = request.FullName.Trim();

        if (request.Mobile is not null)
            entity.Mobile = string.IsNullOrWhiteSpace(request.Mobile) ? null : request.Mobile.Trim();

        if (request.Phone is not null)
            entity.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();

        if (request.Address is not null)
            entity.Address = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim();

        if (request.Description is not null)
            entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();

        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return new ClientDto
        {
            Id = entity.Id,
            FullName = entity.FullName,
            NationalCode = entity.NationalCode,
            Mobile = entity.Mobile,
            Phone = entity.Phone,
            Address = entity.Address,
            Description = entity.Description,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}
