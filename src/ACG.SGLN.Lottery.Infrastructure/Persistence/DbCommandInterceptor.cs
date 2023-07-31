using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Data.Common;

namespace ACG.SGLN.Lottery.Infrastructure.Persistence
{
    public class DbCommandInterceptor : Microsoft.EntityFrameworkCore.Diagnostics.DbCommandInterceptor
    {
        public override InterceptionResult<DbDataReader> ReaderExecuting(DbCommand command, CommandEventData eventData, InterceptionResult<DbDataReader> result)
        {
            System.Console.WriteLine(command.CommandText);

            return base.ReaderExecuting(command, eventData, result);
        }
    }
}
