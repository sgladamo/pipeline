using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Core.Models
{
    [Serializable]
    [Table("WipMaster")]
    public class WipMaster
    {
        [Key]
        public string? Job { get; set; }

        public decimal? Priority { get; set; }
    }
}