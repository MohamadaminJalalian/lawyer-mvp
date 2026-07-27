   // CaseManagement.Api/Middleware/ExceptionHandlingMiddleware.cs
   // Authors: Tarokh Torabi & Mohammad Amin Jalalian

   using System.Net;
   using CaseManagement.Shared.Exceptions;
   using Microsoft.AspNetCore.Http;
   using Microsoft.Extensions.Logging;
   using System.Text.Json;

   namespace CaseManagement.Api.Middleware;

   public sealed class ExceptionHandlingMiddleware
   {
       private readonly RequestDelegate _next;
       private readonly ILogger<ExceptionHandlingMiddleware> _logger;

       public ExceptionHandlingMiddleware(
           RequestDelegate next,
           ILogger<ExceptionHandlingMiddleware> logger)
       {
           _next = next;
           _logger = logger;
       }

       public async Task InvokeAsync(HttpContext context)
       {
           try
           {
               await _next(context);
           }
           catch (Exception ex)
           {
               await HandleExceptionAsync(context, ex, _logger);
           }
       }

       private static async Task HandleExceptionAsync(
           HttpContext context,
           Exception exception,
           ILogger logger)
       {
           var response = context.Response;
           response.ContentType = "application/json";

           string message;
           int statusCode;
           Dictionary<string, string[]> errors;

           switch (exception)
           {
               case ValidationException validationException:
                   statusCode = (int)HttpStatusCode.BadRequest;
                   message = "Validation failed";
                   errors = validationException.Errors;
                   break;

               case NotFoundException notFoundException:
                   statusCode = (int)HttpStatusCode.NotFound;
                   message = notFoundException.Message;
                   errors = new Dictionary<string, string[]>
                   {
                       { "global", new[] { notFoundException.Message } }
                   };
                   break;

               case ConflictException conflictException:
                   statusCode = (int)HttpStatusCode.Conflict;
                   message = conflictException.Message;
                   errors = new Dictionary<string, string[]>
                   {
                       { "global", new[] { conflictException.Message } }
                   };
                   break;

               case UnauthorizedAccessException unauthorizedException:
                   statusCode = (int)HttpStatusCode.Unauthorized;
                   message = unauthorizedException.Message;
                   errors = new Dictionary<string, string[]>
                   {
                       { "global", new[] { unauthorizedException.Message } }
                   };
                   break;

               default:
                   statusCode = (int)HttpStatusCode.InternalServerError;
                   message = "An unexpected error occurred.";
                   errors = new Dictionary<string, string[]>
                   {
                       { "global", new[] { "Internal server error." } }
                   };
                   break;
           }

           logger.LogError(exception, "Unhandled exception occurred.");

           response.StatusCode = statusCode;

           var payload = new
           {
               message,
               errors
           };

           var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
           {
               PropertyNamingPolicy = JsonNamingPolicy.CamelCase
           });

           await response.WriteAsync(json);
       }
   }
