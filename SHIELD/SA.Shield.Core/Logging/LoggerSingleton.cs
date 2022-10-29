using Microsoft.Extensions.Logging;

namespace SA.Shield.Core.Logging
{
    public sealed class LoggerSingleton
    {
        private static readonly Lazy<LoggerSingleton> lazy = new Lazy<LoggerSingleton>(() => new LoggerSingleton());

        public static LoggerSingleton Instance { get { return lazy.Value; } }

        public ILogger ILogger { get; set; }

        private LoggerSingleton()
        {
        }
    }
}
