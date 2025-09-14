namespace SA.Shield.Operations
{
    public class OperationsKPIService
    {
        private readonly OperationsKPIDbContext _database = new OperationsKPIDbContext();

        public int GetTotalItems(string workCentre, DateTime from, DateTime to, string? type)
        {
            var kpiWipCompleteJobs = _database.KPIWIPCompleteJobs.Where(x => x.WorkCentre == workCentre).ToList();
            kpiWipCompleteJobs = kpiWipCompleteJobs.Where(x => x.ActualFinishDate >= from && x.ActualFinishDate <= to).ToList();

            if (type != null)
            {
                kpiWipCompleteJobs = kpiWipCompleteJobs.Where(x => x.ProductSubdivision == type).ToList();
            }

            var totalItems = 0;

            foreach (var wipJob in kpiWipCompleteJobs)
            {
                totalItems += (int)wipJob.QtyCompleted;
            }

            return totalItems;
        }

        public int GetForecastItems(DateTime date, string? type)
        {
            var kpiMrpForecasts = _database.KPIMRPForecasts.Where(x => x.ForecastDate <= date).ToList();
            kpiMrpForecasts = kpiMrpForecasts.Where(x => x.ForecastDate.Value.Month == date.Month && x.ForecastDate.Value.Year == date.Year).ToList();

            if (type != null)
            {
                kpiMrpForecasts = kpiMrpForecasts.Where(x => x.ProductSubdivision == type).ToList();
            }

            var forecast = 0;

            foreach (var kpi in kpiMrpForecasts)
            {
                forecast += (int)kpi.ForecastQtyOutst;
            }

            return forecast;
        }
    }
}
