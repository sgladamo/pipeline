using Microsoft.Extensions.Logging;

namespace SA.Shield.Core.Logging
{
    public sealed class ColourConsoleLogger : ILogger
    {
        private readonly string _name;
        private readonly Func<ColourConsoleLoggerConfiguration> _getCurrentConfig;
        private readonly object _consoleLock = new();

        public ColourConsoleLogger(string name, Func<ColourConsoleLoggerConfiguration> getCurrentConfig) => (_name, _getCurrentConfig) = (name, getCurrentConfig);

        public IDisposable BeginScope<TState>(TState state) => default!;

        public bool IsEnabled(LogLevel logLevel) => _getCurrentConfig().LogLevels.ContainsKey(logLevel);

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel))
                return;

            ColourConsoleLoggerConfiguration config = _getCurrentConfig();
            if (config.EventId == 0 || config.EventId == eventId.Id)
            {
                lock (_consoleLock)
                {
                    Console.BackgroundColor = logLevel == LogLevel.Critical ? ConsoleColor.White : ConsoleColor.Black;
                    Console.ForegroundColor = ConsoleColor.Gray;
                    Console.Write($"{DateTime.UtcNow} ");
                    Console.Write($"{logLevel} ");
                    Console.Write($"{_name} ");

                    Console.ForegroundColor = config.LogLevels[logLevel];
                    Console.Write($"{formatter(state, exception)}");

                    Console.BackgroundColor = ConsoleColor.Black;
                    Console.ForegroundColor = ConsoleColor.Gray;
                    Console.WriteLine();
                }
            }
        }
    }
}
