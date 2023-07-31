using System;

namespace ACG.SGLN.Lottery.Application.Common.Exceptions
{
    public class InvalidOperationException : Exception
    {
        public InvalidOperationException()
            : base("Opération invalide")
        {
        }

        public InvalidOperationException(string message)
            : base(message)
        {
        }

        public InvalidOperationException(string resource, object operation)
            : base($"Operation '{operation}' on resource ({resource}) is not valid.")
        {
        }
    }
}