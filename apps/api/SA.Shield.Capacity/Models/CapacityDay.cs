using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Capacity.Models
{
    [Serializable]
    [Table("CapacityDay")]
    public class CapacityDay
    {
        [Key]
        public string CapacityDayId { get; set; }

        public DateTime Day { get; set; }

        public double AvailableHours { get; set; }

        public double HoursUsed { get; set; }

        public string Cell { get; set; }

        public ICollection<CapacityJob> CapacityJobs { get; set; }
    }
}
