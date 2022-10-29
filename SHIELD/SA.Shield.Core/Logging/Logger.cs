using Microsoft.Extensions.Logging;

namespace SA.Shield.Core.Logging
{
    public static class Logger
    {
        public static void Debug(string message)
        {
            LoggerSingleton.Instance.ILogger.LogDebug(message);
        }

        public static void Info(string message)
        {
            LoggerSingleton.Instance.ILogger.LogInformation(message);
        }

        public static void Warning(string message)
        {
            LoggerSingleton.Instance.ILogger.LogWarning(message);
        }

        public static void Error(string message)
        {
            LoggerSingleton.Instance.ILogger.LogError(message);
        }

        public static void Critical(string message)
        {
            LoggerSingleton.Instance.ILogger.LogCritical(message);
        }

        public static void Trace(string message)
        {
            LoggerSingleton.Instance.ILogger.LogTrace(message);
        }
    }
}
