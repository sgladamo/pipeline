using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SA.Shield.Operations.Models
{
    [Serializable]
    [Keyless]
    [Table("WIPCurrentOp")]
    public class WipCurrentOp
    {
        public string? Job { get; set; }

        public string? JobDescription { get; set; }

        public string? WorkCentre { get; set; }

        public string? StockCode { get; set; }

        public string? StockDescription { get; set; }

        public decimal? LowestOP { get; set; }

        public decimal? Priority { get; set; }

        public string? NextWorkCentre { get; set; }

        public string? NextWorkCentreIMachine { get; set; }

        public decimal? QtyToMake { get; set; }

        public string? IMachine { get; set; }

        public char? HoldFlag { get; set; }

        public string? DefaultBin { get; set; }

        public string? ExplodedDiagram { get; set; }

        public string? SOP { get; set; }

        public char? Complete { get; set; }
    }
}
