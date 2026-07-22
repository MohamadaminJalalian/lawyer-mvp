// CaseManagement.Shared/Contracts/PagedResponse.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Shared.Contracts;

public sealed record PagedResponse<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);

public interface IPagedResponseFactory
{
    PagedResponse<T> Create<T>(
        IReadOnlyList<T> items,
        int page,
        int pageSize,
        int totalCount);
}

public sealed class PagedResponseFactory : IPagedResponseFactory
{
    public PagedResponse<T> Create<T>(
        IReadOnlyList<T> items,
        int page,
        int pageSize,
        int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return new PagedResponse<T>(items, page, pageSize, totalCount, totalPages);
    }
}

