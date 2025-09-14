using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Boxing.Models
{
    [Serializable]
    [Table("boxing_job_details")]
    public class BoxingJobDetails
    {
        [Key]
        [Column("id")]
        public decimal? Id { get; set; }

        [Column("job")]
        public string? Job { get; set; }

        [Column("notes")]
        public string? Notes { get; set; } 

        [Column("time_remaining")]
        public int? TimeRemaining { get; set; }
    }
}
