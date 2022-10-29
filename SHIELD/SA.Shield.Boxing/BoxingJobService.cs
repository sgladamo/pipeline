using SA.Shield.Boxing.Models;

namespace SA.Shield.Boxing
{
    public class BoxingJobService : IDisposable
    {
        private readonly BoxingJobDbContext _database;

        public BoxingJobService()
        {
            _database = new BoxingJobDbContext();
        }

        public BoxingJobDetails GetJobDetails(string job)
        {
            return _database.BoxingJobDetails.Where(o => o.Job.Equals(job)).First();
        }

        private bool BoxingJobDetailsExist(string job)
        {
            if (_database.BoxingJobDetails.Any(o => o.Job.Equals(job)))
                return true;
            else
                return false;
        }

        public void UpdateNotes(BoxingJobDetails boxingJobDetails)
        {
            if (BoxingJobDetailsExist(boxingJobDetails.Job))
            {
                _database.BoxingJobDetails.First(o => o.Job.Equals(boxingJobDetails.Job)).Notes = boxingJobDetails.Notes;
                _database.SaveChanges();
            }
            else
            {
                _database.BoxingJobDetails.Add(new BoxingJobDetails()
                {
                    Job = boxingJobDetails.Job,
                    Notes = boxingJobDetails.Notes,
                    TimeRemaining = 0
                });
                _database.SaveChanges();
            }
        }

        public void UpdateTimeRemaining(BoxingJobDetails boxingJobDetails)
        {
            if (BoxingJobDetailsExist(boxingJobDetails.Job))
            {
                _database.BoxingJobDetails.First(o => o.Job.Equals(boxingJobDetails.Job)).TimeRemaining = boxingJobDetails.TimeRemaining;
                _database.SaveChanges();
            }
            else
            {
                _database.BoxingJobDetails.Add(new BoxingJobDetails()
                {
                    Job = boxingJobDetails.Job,
                    Notes = "",
                    TimeRemaining = boxingJobDetails.TimeRemaining
                });
                _database.SaveChanges();
            }
        }

        public void Dispose()
        {
            _database.Dispose();
        }
    }
}
