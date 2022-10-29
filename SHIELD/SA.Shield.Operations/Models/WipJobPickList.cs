using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SA.Shield.Operations.Models
{
    [Serializable]
    [Keyless]
    [Table("WIPJobPickList")]
    public class WipJobPickList
    {
        public string? Job { get; set; }

        public string? StockCode { get; set; }
    
        public string? StockDescription { get; set; }

        public string? LongDesc { get; set; }

        public string? Uom { get; set; }

        public string? Bin { get; set; }

        public decimal? TotalReqd { get; set; }

        public decimal? QtyIssued { get; set; }

        public decimal? Balance { get; set; }
    }
}
