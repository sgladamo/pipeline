namespace SA.Shield.Capacity
{
    public class CapacityKPIService
    {
        private readonly CapacityKPIDbContext _database = new CapacityKPIDbContext();

        //public int GetTotalHoursAvailable(string from, string to)
        //{
        //    var fromDateTime = DateTime.Parse(from);
        //    var toDateTime = DateTime.Parse(to);

        //    var capacityDays = _database.CapacityDays.Where(x => x.WorkCentre == workCentre).ToList();

        //    return totalItems;
        //}
    }
}
