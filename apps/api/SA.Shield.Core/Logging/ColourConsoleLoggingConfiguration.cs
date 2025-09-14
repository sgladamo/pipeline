using Microsoft.Extensions.Logging;

namespace SA.Shield.Core.Logging
{
    public class ColourConsoleLoggerConfiguration
    {
        public int EventId { get; set; }

        public Dictionary<LogLevel, ConsoleColor> LogLevels { get; set; } = new()
        {
            [LogLevel.Debug] = ConsoleColor.Cyan,
            [LogLevel.Information] = ConsoleColor.Green,
            [LogLevel.Warning] = ConsoleColor.Yellow,
            [LogLevel.Error] = ConsoleColor.DarkRed,
            [LogLevel.Critical] = ConsoleColor.DarkRed,
            [LogLevel.Trace] = ConsoleColor.Gray
        };
    }
}
