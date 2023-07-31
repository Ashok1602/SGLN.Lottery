using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Common.Models
{
    public abstract class PagedResultBase
    {
        public const int DefaultPageSize = 20;
        public const int MaxPageSize = 9999;

        public int CurrentPage { get; set; }
        public int PageCount { get; set; }
        public int PageSize { get; set; }
        public int RowCount { get; set; }

        public int FirstRowOnPage => (CurrentPage - 1) * PageSize + 1;

        public int LastRowOnPage => Math.Min(CurrentPage * PageSize, RowCount);
    }

    public class PagedResult<T> : PagedResultBase where T : class
    {
        public PagedResult()
        {
            Results = new List<T>();
        }

        public IReadOnlyList<T> Results { get; set; }
    }
}