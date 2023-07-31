using ACG.SGLN.Lottery.Application.Common.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Extensions
{
    public static class IQueryables
    {
        public static IQueryable<T> Includes<T>(this IQueryable<T> source,
            params Expression<Func<T, object>>[] paths)
            where T : class, new()
        {
            if (paths != null)
                source = paths.Aggregate(source,
                    (current, path) => current.Include(path));

            return source;
        }

        public static IQueryable<T> ToPagedQuery<T>(this IQueryable<T> source, int page, int pageSize)
            where T : class
        {
            if (source == null) throw new ArgumentNullException(nameof(source));

            if (pageSize > 0 && page > 0) source = source.Skip(pageSize * (page - 1)).Take(pageSize);

            return source;
        }

        public static Task<PagedResult<T>> GetPaged<T>(this IQueryable<T> query,
            int page, int pageSize) where T : class
        {
            var result = new PagedResult<T>
            {
                CurrentPage = page,
                PageSize = pageSize,
                RowCount = query.Count()
            };


            var pageCount = (double)result.RowCount / pageSize;

            result.PageCount = (int)Math.Ceiling(pageCount);
            result.Results = query.ToPagedQuery(page, pageSize).ToList();

            return Task.FromResult(result);
        }
    }
}