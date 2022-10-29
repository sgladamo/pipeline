using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Operations.Models
{
    [Serializable]
    [Keyless]
    [Table("KPIMRPForecastMadeIn")]
    public class KPIMRPForecastMadeIn
    {
        public string? StockCode { get; set; }

        public DateTime? ForecastDate { get; set; }

        public decimal? ForecastQtyOutst { get; set; }

        public string? ProductSubdivision { get; set; }
    }
}
