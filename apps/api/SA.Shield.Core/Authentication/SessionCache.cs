using SA.Shield.Core.Logging;

namespace SA.Shield.Core.Authentication
{
    public sealed class SessionCache
    {
        private static readonly Lazy<SessionCache> lazy = new(() => new SessionCache());

        public static SessionCache Instance { get { return lazy.Value; } }

        private Dictionary<string, DateTime> Sessions { get; set; } = new();

        public void Cache(string sessionId)
        {
            try
            {
                if (!Sessions.ContainsKey(sessionId))
                    Sessions.Add(sessionId, DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
        }

        public void Clean()
        {
            Logger.Info("Cleaning Capacity Session Cache");

            try
            {
                var itemsToRemove = Sessions.Where(session => DateTime.UtcNow > session.Value.AddDays(1)).ToArray();
                foreach (var item in itemsToRemove)
                    Sessions.Remove(item.Key);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
        }

        public bool Exists(string sessionId)
        {
            try
            {
                if (Sessions.ContainsKey(sessionId))
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                return false;
            }
        }

        private SessionCache()
        {
        }
    }
}
