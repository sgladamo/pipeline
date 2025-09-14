using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;

namespace SA.Shield.Core.Logging
{
    [ProviderAlias("ColourConsole")]
    public sealed class ColourConsoleLoggerProvider : ILoggerProvider
    {
        private readonly IDisposable _onChangeToken;
        private ColourConsoleLoggerConfiguration _currentConfig;
        private readonly ConcurrentDictionary<string, ColourConsoleLogger> _loggers = new(StringComparer.OrdinalIgnoreCase);

        public ColourConsoleLoggerProvider(IOptionsMonitor<ColourConsoleLoggerConfiguration> config)
        {
            _currentConfig = config.CurrentValue;
            _onChangeToken = config.OnChange(updatedConfig => _currentConfig = updatedConfig);
        }

        public ILogger CreateLogger(string categoryName) => _loggers.GetOrAdd(categoryName, name => new ColourConsoleLogger(name, GetCurrentConfig));

        private ColourConsoleLoggerConfiguration GetCurrentConfig() => _currentConfig;

        public void Dispose()
        {
            _loggers.Clear();
            _onChangeToken.Dispose();
        }
    }
}
