using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Core.Models
{
    [Serializable]
    [Table("WipJobAllLab")]
    public class WipJobAllLab
    {
        public string? Job { get; set; }

        public decimal? Operation { get; set; }

        public string? WorkCentre { get; set; }

        public string? WorkCentreDesc { get; set; }

        public char? OperCompleted { get; set; }

        public DateTime? PlannedEndDate { get; set; }

        public string? IMachine { get; set; }

        public decimal? QtyCompleted { get; set; }

        public DateTime? ActualFinishDate { get; set; }
    }
}