using SA.Shield.Capacity.Models;
using SA.Shield.Core.Logging;

namespace SA.Shield.Capacity
{
    public class CapacityService
    {
        private CapacityDbContext _database = new CapacityDbContext();
        private static readonly string[] _cells = new string[] { "CELL01", "CELL02", "CELL03", "CELL04", "CELL05", "CELL06", "CELL07" };
        private System.Timers.Timer? _capacityUpdater;
        public void StartUpdater()
        {
            Logger.Info("Starting Capacity Updater");
            _capacityUpdater = new System.Timers.Timer();
            _capacityUpdater.Interval = 60000;
            _capacityUpdater.Elapsed += CapacityUpdater_Elapsed;
            _capacityUpdater.Start();
        }

        private void CapacityUpdater_Elapsed(object? sender, System.Timers.ElapsedEventArgs e)
        {
            _database = new CapacityDbContext();
            UpdateAllCellCapacities();
        }

        public void InitialiseCapacityTables()
        {
            if (!_database.CapacityDays.Any())
            {
                GenerateCapacityDays();
            }

            UpdateAllCellCapacities();

            if (!_database.CapacityLostHours.Any())
            {
                GenerateLostHours();
            }
        }

        private void GenerateLostHours()
        {
            Logger.Info("Generating Lost Hours");

            try
            {
                DateTime begin = new DateTime(2020, 01, 01);
                DateTime end = new DateTime(2030, 01, 01);

                while (begin < end)
                {
                    var lostHours = new CapacityLostHours()
                    {
                        Date = begin,
                        Quality = 0,
                        Other = 0
                    };
                    _database.CapacityLostHours.Add(lostHours);
                    begin = begin.AddMonths(1);
                }
                _database.SaveChanges();
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                Logger.Error("Error Whilst Generating Lost Hours");
            }
        }

        /// <summary>
        /// Generate all CapacityDays.
        /// Set hours to 7.25 as default.
        /// Set hours to 0 for weekends.
        /// </summary>
        private void GenerateCapacityDays()
        {
            Logger.Info("Generating Capacity Days");

            try
            {
                DateTime begin = new DateTime(2020, 01, 01);
                DateTime end = new DateTime(2030, 01, 01);

                while (begin < end)
                {
                    foreach (var cell in _cells)
                    {
                        var newCapacityDay = new CapacityDay()
                        {
                            CapacityDayId = Guid.NewGuid().ToString(),
                            Day = begin,
                            // Friday = Saturday, Saturday = Sunday
                            AvailableHours = begin.DayOfWeek != DayOfWeek.Saturday && begin.DayOfWeek != DayOfWeek.Sunday ? 7.25 : 0,
                            HoursUsed = 0,
                            Cell = cell,
                        };
                        _database.CapacityDays.Add(newCapacityDay);
                    }
                    begin = begin.AddDays(1);
                }
                _database.SaveChanges();
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                Logger.Error("Error Whilst Generating Capacity Days");
            }
        }

        private void UpdateAllCellCapacities()
        {
            Logger.Info("Updating All Cell Capacities");

            try
            {
                foreach (var cell in _cells)
                {
                    UpdateCellCapacities(cell);
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                Logger.Error("Error Whilst Updating All Cell Capacities");
            }
        }

        private void UpdateCellCapacities(string cell)
        {
            var firstAvailableDate = DateTime.Today;
            var capacityDays = GetCapacityDays(cell);
            foreach (var day in capacityDays)
            {
                if (day.HoursUsed > 0)
                {
                    day.HoursUsed = 0;
                    var jobs = GetCapacityJobs(day.CapacityDayId);
                    _database.CapacityJobs.RemoveRange(jobs);
                }
            }
            _database.SaveChanges();
            var cellAssemblyTimes = _database.WipAssemblyTimes.Where(x => x.IMachine == cell).OrderBy(x => x.Priority).ToList();

            foreach (var assemblyTime in cellAssemblyTimes)
            {
                if (assemblyTime.Complete == 'N')
                {
                    var timeToBeUsed = (double)assemblyTime.TotalTime;

                    while (timeToBeUsed > 0)
                    {
                        var date = capacityDays.Where(x => x.Day == firstAvailableDate).First();
                        var available = date.AvailableHours - date.HoursUsed;

                        if (available > 0)
                        {
                            // Fits within time available
                            if (date.AvailableHours - date.HoursUsed >= timeToBeUsed)
                            {
                                date.HoursUsed += timeToBeUsed;
                                var capacityJob = new CapacityJob()
                                {
                                    CapacityJobId = Guid.NewGuid().ToString(),
                                    Job = assemblyTime.Job,
                                    TimeUsed = timeToBeUsed,
                                    StockCode = assemblyTime.StockCode,
                                    StockDescription = assemblyTime.StockDescription,
                                    Cell = assemblyTime.IMachine,
                                    Priority = (double)assemblyTime.Priority,
                                    Qty = (double)assemblyTime.QtyToMake,
                                    WorkCentre = assemblyTime.WorkCentre
                                };
                                if (date.CapacityJobs == null)
                                    date.CapacityJobs = new List<CapacityJob>();
                                date.CapacityJobs.Add(capacityJob);
                                timeToBeUsed -= timeToBeUsed;
                            }
                            // Overruns time available
                            else
                            {
                                var capacityJob = new CapacityJob()
                                {
                                    CapacityJobId = Guid.NewGuid().ToString(),
                                    Job = assemblyTime.Job,
                                    TimeUsed = available,
                                    StockCode = assemblyTime.StockCode,
                                    StockDescription = assemblyTime.StockDescription,
                                    Cell = assemblyTime.IMachine,
                                    Priority = (double)assemblyTime.Priority,
                                    Qty = (double)assemblyTime.QtyToMake,
                                    WorkCentre = assemblyTime.WorkCentre
                                };
                                timeToBeUsed -= available;
                                if (date.CapacityJobs == null)
                                    date.CapacityJobs = new List<CapacityJob>();
                                date.CapacityJobs.Add(capacityJob);
                                date.HoursUsed += available;
                            }
                        }
                        else
                        {
                            firstAvailableDate = firstAvailableDate.AddDays(1);
                        }
                    }
                }
            }

            _database.SaveChanges();
        }

        public void UpdateCapacityDay(string capacityDayId, double hours)
        {
            Logger.Info($"Updating Capacity Day: ID={capacityDayId} Hours={hours}");

            try
            {
                var capacityDay = _database.CapacityDays.Where(x => x.CapacityDayId == capacityDayId).First();
                capacityDay.AvailableHours = hours;
                _database.SaveChanges();
                UpdateCellCapacities(capacityDay.Cell);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                Logger.Info($"Error Whilst Updating Capacity Day: ID={capacityDayId} Hours={hours}");
            }
        }

        private List<CapacityDay> GetCapacityDays(string cell)
        {
            var capacityDays = _database.CapacityDays.Where(x => x.Cell == cell).ToList();
            capacityDays.Sort((a, b) => a.Day.CompareTo(b.Day));
            return capacityDays;
        }

        public List<CapacityDay> GetCellCapacityDays(string cell, DateTime from, DateTime to)
        {
            Logger.Debug($"Getting Capacity Days: Cell={cell} From={from} To={to}");

            var capacityDays = _database.CapacityDays.Where(x => x.Cell == cell).Where(x => x.Day >= from).Where(x => x.Day <= to).ToList();
            capacityDays = capacityDays.Where(x => x.Day.DayOfWeek != DayOfWeek.Saturday).ToList();
            capacityDays = capacityDays.Where(x => x.Day.DayOfWeek != DayOfWeek.Sunday).ToList();
            capacityDays.Sort((a, b) => a.Day.CompareTo(b.Day));

            foreach (var capacityDay in capacityDays)
            {
                var capacityJobs = GetCapacityJobs(capacityDay.CapacityDayId);
                if (capacityJobs.Count > 0)
                    capacityDay.CapacityJobs = capacityJobs;
            }

            return capacityDays;
        }

        public Dictionary<string, List<CapacityDay>> GetAllCapacityDays(DateTime from, DateTime to)
        {
            Logger.Debug($"Getting Capacity Days: From={from} To={to}");
            var allCapacityDays = new Dictionary<string, List<CapacityDay>>();

            foreach (var cell in _cells)
            {
                var capacityDays = GetCellCapacityDays(cell, from, to);
                allCapacityDays.Add(cell, capacityDays);
            }

            return allCapacityDays;
        }

        private List<CapacityJob> GetCapacityJobs(string capacityDayId)
        {
            return _database.CapacityJobs.Where(x => x.CapacityDayId == capacityDayId).ToList();
        }

        public CapacityJob? GetCapacityJob(string capacityJobId)
        {
            return _database.CapacityJobs.Where(x => x.CapacityJobId == capacityJobId).FirstOrDefault();
        }

        public async Task UpdateJobPriority(string job, decimal priority)
        {
            Logger.Debug($"Updating Job Priority: Job={job} Priority={priority}");
            await UpdateJobPriorityAsync(job, priority);
            UpdateAllCellCapacities();
        }

        public async Task UpdateJobCell(string job, string cell)
        {
            Logger.Debug($"Updating Job Cell: Job={job} Cell={cell}");
            await UpdateJobCellAsync(job, cell);
            UpdateAllCellCapacities();
        }

        public CapacityLostHours GetLostHours(DateTime date)
        {
            return _database.CapacityLostHours.Where(x => x.Date == date).First();
        }

        public async Task UpdateLostHours(DateTime date, CapacityLostHours capacityLostHours)
        {
            Logger.Debug($"Updating Lost Hours: Date={capacityLostHours.Date} Quality={capacityLostHours.Quality} Other={capacityLostHours.Other}");
            var lostHours = _database.CapacityLostHours.Where(x => x.Date == date).First();

            if (lostHours != null)
            {
                lostHours.Quality = capacityLostHours.Quality;
                lostHours.Other = capacityLostHours.Other;
                await _database.SaveChangesAsync();
            }
        }

        public async Task ShiftCapacityJob(string capacityJobId, string capacityDayId, int index)
        {
            try
            {
                CapacityDay? capacityDay = _database.CapacityDays.FirstOrDefault(x => x.CapacityDayId == capacityDayId);

                if (capacityDay != null)
                {
                    var newCell = capacityDay.Cell;

                    if (newCell != null)
                    {
                        var capacityDayJobs = _database.CapacityJobs.Where(x => x.CapacityDayId == capacityDayId).OrderBy(x => x.Priority).ToList();
                        var cellCapacityJobs = _database.CapacityJobs.Where(x => x.Cell == newCell).OrderBy(x => x.Priority).ToList();

                        if (capacityDayJobs != null && capacityDayJobs.Count > 0)
                        {
                            var capacityJob = _database.CapacityJobs.FirstOrDefault(x => x.CapacityJobId == capacityJobId);
                            if (capacityJob != null)
                            {
                                if (capacityDayId == capacityJob.CapacityDayId && index == capacityDayJobs.Count - 1)
                                {
                                    var newPriority = capacityDayJobs.ElementAt(index).Priority + 1;

                                    if (newPriority != capacityJob.Priority)
                                    {
                                        await UpdateJobPriorityAsync(capacityJob.Job, (decimal)newPriority);
                                    }

                                    if (newCell != capacityJob.Cell)
                                    {
                                        await UpdateJobCellAsync(capacityJob.Job, newCell);
                                    }

                                    var jobsUpdated = new List<string>();

                                    foreach (var cj in cellCapacityJobs)
                                    {
                                        if (cj.Job != capacityJob.Job && cj.Priority >= newPriority && !jobsUpdated.Exists(x => x == cj.Job))
                                        {
                                            await UpdateJobPriorityAsync(cj.Job, (decimal)cj.Priority + 1);
                                            jobsUpdated.Add(cj.Job);
                                        }
                                    }
                                }
                                else if (index < capacityDayJobs.Count)
                                {
                                    var elementAtIndex = capacityDayJobs.ElementAt(index);
                                    var newPriority = elementAtIndex.Priority;

                                    if (newPriority != capacityJob.Priority)
                                    {
                                        await UpdateJobPriorityAsync(capacityJob.Job, (decimal)newPriority);
                                    }

                                    if (newCell != capacityJob.Cell)
                                    {
                                        await UpdateJobCellAsync(capacityJob.Job, newCell);
                                    }

                                    var jobsUpdated = new List<string>();

                                    foreach (var cj in cellCapacityJobs)
                                    {
                                        if (cj.Job != capacityJob.Job && cj.Priority >= newPriority && !jobsUpdated.Exists(x => x == cj.Job))
                                        {
                                            await UpdateJobPriorityAsync(cj.Job, (decimal)cj.Priority + 1);
                                            jobsUpdated.Add(cj.Job);
                                        }
                                    }
                                }
                                else
                                {
                                    var elementAtIndexMinus1 = capacityDay.CapacityJobs.OrderBy(x => x.Priority).ElementAt(index - 1);
                                    var newPriority = elementAtIndexMinus1.Priority + 1;

                                    if (newPriority != capacityJob.Priority)
                                    {
                                        await UpdateJobPriorityAsync(capacityJob.Job, (decimal)newPriority);
                                    }

                                    if (newCell != capacityJob.Cell)
                                    {
                                        await UpdateJobCellAsync(capacityJob.Job, newCell);
                                    }
                                }
                            }
                        }
                    }

                    UpdateAllCellCapacities();
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
        }

        private async Task UpdateJobPriorityAsync(string job, decimal priority)
        {
            var wipMasterJob = _database.WipMasters.Where(x => x.Job == job).First();

            if (wipMasterJob != null)
            {
                wipMasterJob.Priority = priority;
                await _database.SaveChangesAsync();
            }
        }

        private async Task UpdateJobCellAsync(string job, string cell)
        {
            var wipJobAllLab = _database.WipJobAllLabs.Where(x => x.Job == job).Where(x => x.WorkCentre == "ASSY01").First();

            if (wipJobAllLab != null)
            {
                wipJobAllLab.IMachine = cell;
                await _database.SaveChangesAsync();
            }
        }
    }
}
