using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Capacity.Models
{
    [Serializable]
    [Table("CapacityLostHours")]
    public class CapacityLostHours
    {
        [Key]
        public DateTime? Date { get; set; }

        public decimal Quality { get; set; }

        public decimal Other { get; set; }
    }
}
