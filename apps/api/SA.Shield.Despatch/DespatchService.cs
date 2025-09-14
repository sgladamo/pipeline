using Microsoft.Extensions.Configuration;
using SA.Shield.Despatch.Models;

namespace SA.Shield.Despatch
{
    public class DespatchService : IDisposable
    {
        private readonly DespatchDbContext _database;

        public DespatchService()
        {
            _database = new DespatchDbContext();
        }

        public List<DespDashboard> GetToBePicked() => _database.DespDashboard.Where(o => o.Status == null).ToList();

        public List<DespDashboard> GetLargeShipments() => _database.DespDashboard.Where(o => o.Status.Equals("Picking")).ToList();

        public List<DespDashboard> GetPacking() => _database.DespDashboard.Where(o => o.Status.Equals("Complete") && o.ReadyToCollect == null).ToList();

        public List<DespDashboard> GetCompleted() => _database.DespDashboard.Where(o => o.Status.Equals("Complete") && o.ReadyToCollect != null).ToList();

        public void Dispose()
        {
            _database.Dispose();
        }
    }
}