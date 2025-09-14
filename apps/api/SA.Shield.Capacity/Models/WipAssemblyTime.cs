using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Capacity.Models
{
    [Serializable]
    [Keyless]
    [Table("WIPAssemblyTime")]
    public class WipAssemblyTime
    {
        public string? Job { get; set; }

        public string? StockCode { get; set; }

        public string? StockDescription { get; set; }

        public decimal? QtyToMake { get; set; }

        public decimal? IExpUnitRunTim { get; set; }

        public string? IMachine { get; set; }

        public string? WorkCentre { get; set; }

        public decimal? Priority { get; set; }

        public char? ConfirmedFlag { get; set; }

        public decimal TotalTime { get; set; }

        public char? Complete { get; set; }
    }
}
