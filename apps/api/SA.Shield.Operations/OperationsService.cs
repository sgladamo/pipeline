using SA.Shield.Core.Models;
using SA.Shield.Operations.Models;

namespace SA.Shield.Operations
{
    public class OperationsService : IDisposable
    {
        private readonly OperationsDbContext _database = new OperationsDbContext();

        public List<WipCurrentOp> GetCurrentOps(string job, string workCentre)
        {
            if (job != null)
            {
                return _database.WipCurrentOps.Where(o => o.Job.Equals(job)).ToList();

            }
            else if (workCentre != null)
            {
                return _database.WipCurrentOps.Where(o => o.WorkCentre.Equals(workCentre)).ToList();
            }
            else
            {
                return _database.WipCurrentOps.ToList();
            }
        }

        public List<WipJobAllLab> GetAllOps(string? job)
        {
            return job == null ? _database.WipJobAllLab.ToList() : _database.WipJobAllLab.Where(o => o.Job.Equals(job)).ToList();
        }

        public List<WipCurrentOp> GetAssemblyOps(string? cell)
        {
            if (cell != null)
            {
                return _database.WipCurrentOps.Where(o => o.WorkCentre.Equals(cell) || o.IMachine.Equals(cell)).ToList();
            }
            else
            {
                return _database.WipCurrentOps.Where(o => o.WorkCentre.Contains("CELL") || o.WorkCentre.Equals("ASSY01")).ToList();
            }
        }

        public List<WipCurrentOp> GetTrolleyStorageOps(string? nextWorkCentreIMachine)
        {
            if (nextWorkCentreIMachine != null)
            {
                return _database.WipCurrentOps.Where(o => o.WorkCentre.Equals("TROL01") && o.NextWorkCentreIMachine.Equals(nextWorkCentreIMachine)).ToList();
            }
            else
            {
                return _database.WipCurrentOps.Where(o => o.WorkCentre.Equals("TROL01") || o.WorkCentre.Equals("TRST01")).ToList();
            }
        }

        public List<WipCurrentOp> GetPickingOps()
        {
            return _database.WipCurrentOps.Where(o => o.WorkCentre.Equals("SA02") || o.WorkCentre.Equals("PICK01")).ToList();
        }

        public List<WipJobPickList> GetPickList(string? job)
        {
            return _database.WipJobPickList.Where(o => o.Job.Equals(job)).ToList();
        }

        public List<WipCurrentOp> GetBoxingOps()
        {
            return _database.WipCurrentOps.Where(o => o.WorkCentre.Equals("BOXI01")).ToList();
        }

        public async Task UpdateJobPriorityAsync(string job, decimal priority)
        {
            var wipMasterJob = _database.WipMasters.Where(x => x.Job == job).First();

            if (wipMasterJob != null)
            {
                wipMasterJob.Priority = priority;
                await _database.SaveChangesAsync();
            }
        }

        public async Task UpdateJobCellAsync(string job, string cell)
        {
            var wipJobAllLab = _database.WipJobAllLab.Where(x => x.Job == job).Where(x => x.WorkCentre == "ASSY01").First();

            if (wipJobAllLab != null)
            {
                wipJobAllLab.IMachine = cell;
                //_database.WipJobAllLab.Update(wipJobAllLab);
                await _database.SaveChangesAsync();

            }
        }

        public void Dispose()
        {
            _database.Dispose();
        }
    }
}
