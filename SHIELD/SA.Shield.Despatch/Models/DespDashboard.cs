using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SA.Shield.Despatch.Models
{
    [Serializable]
    [Table("DESPDashboard")]
    [Keyless]
    public class DespDashboard
    {
        public string? DispatchNote { get; set; }

        public char? DispatchNoteStatus { get; set; }

        public decimal? Priority { get; set; }

        public string? PackingInstructions { get; set; }

        public string? AccountNumber { get; set; }

        public string? Customer { get; set; }

        public DateTime? ActualDeliveryDate { get; set; }

        public char? ActiveFlag { get; set; }

        public string? Status { get; set; }

        public string? ReadyToCollect { get; set; }

        public string? Comment { get; set; }

        public string? SalesOrder { get; set; }
    }
}
