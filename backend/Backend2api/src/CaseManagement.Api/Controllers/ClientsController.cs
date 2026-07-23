// File: CaseManagement.Api/Controllers/ClientsController.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Application.Clients.Dtos;
using CaseManagement.Application.Clients.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CaseManagement.Api.Controllers;

[ApiController]
[Route("api/v1/clients")]
public sealed class ClientsController : ControllerBase
{
    private readonly IClientService _service;

    public ClientsController(IClientService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN,STAFF")]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _service.GetPagedAsync(page, pageSize, search, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN,STAFF")]
    public async Task<IActionResult> Create(
        [FromBody] CreateClientRequest request,
        CancellationToken cancellationToken = default)
    {
        var created = await _service.CreateAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, created);
    }

    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "ADMIN,STAFF")]
    public async Task<IActionResult> Update(
        [FromRoute] Guid id,
        [FromBody] UpdateClientRequest request,
        CancellationToken cancellationToken = default)
    {
        var updated = await _service.UpdateAsync(id, request, cancellationToken);
        return Ok(updated);
    }
}
