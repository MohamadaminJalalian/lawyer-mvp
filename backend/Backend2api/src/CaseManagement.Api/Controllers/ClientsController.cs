using CaseManagement.Application.Clients.Dtos;
using CaseManagement.Application.Clients.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CaseManagement.Api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize(Policy = "StaffOrAdmin")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        // GET /api/v1/clients?page=1&pageSize=10&search=...
        [HttpGet]
        public async Task<IActionResult> GetClients(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var result = await _clientService.GetClientsAsync(page, pageSize, search);

            var response = new
            {
                items = result.Items,      // List<ClientListItemDto>
                page = result.Page,
                pageSize = result.PageSize,
                totalCount = result.TotalCount,
                totalPages = result.TotalPages
            };

            return Ok(response);
        }

        // GET /api/v1/clients/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetClientById(int id)
        {
            ClientDto? client = await _clientService.GetClientByIdAsync(id);
            if (client == null)
            {
                return NotFound(new
                {
                    message = "Client not found"
                });
            }

            return Ok(client);
        }

        // POST /api/v1/clients
        [HttpPost]
        public async Task<IActionResult> CreateClient([FromBody] CreateClientRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem();
            }

            try
            {
                ClientDto createdClient = await _clientService.CreateClientAsync(request);

                return CreatedAtAction(
                    nameof(GetClientById),
                    new { id = createdClient.Id },
                    createdClient);
            }
            catch (ClientConflictException ex)
            {
                return Conflict(new
                {
                    message = ex.Message,
                    errors = ex.Errors
                });
            }
        }

        // PATCH /api/v1/clients/{id}
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] UpdateClientRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem();
            }

            bool updated = await _clientService.UpdateClientAsync(id, request);
            if (!updated)
            {
                return NotFound(new
                {
                    message = "Client not found"
                });
            }

            return NoContent();
        }
    }
}
