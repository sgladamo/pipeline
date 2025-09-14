using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Capacity.Models
{
    [Serializable]
    [Table("CapacityJob")]
    public class CapacityJob
    {
        [Key]
        public string CapacityJobId { get; set; }

        public string Job { get; set; }

        public double TimeUsed { get; set; }

        public string CapacityDayId { get; set; }

        public string StockCode { get; set; }

        public string StockDescription { get; set; }

        public string Cell { get; set; }

        public double Priority { get; set; }

        public double Qty { get; set; }

        public string WorkCentre { get; set; }
    }
}
