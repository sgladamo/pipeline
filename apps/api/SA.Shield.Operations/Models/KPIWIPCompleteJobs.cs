using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Operations.Models
{
    [Serializable]
    [Keyless]
    [Table("KPIWIPCompleteJobs")]
    public class KPIWIPCompleteJobs
    {
        public DateTime? ActualFinishDate { get; set; }

        public string? StockCode { get; set; }

        public decimal? QtyCompleted { get; set; }

        public string? WorkCentre { get; set; }

        public string? SubDivCategory { get; set; }

        public string? ProductSubdivision { get; set; }
    }
}
