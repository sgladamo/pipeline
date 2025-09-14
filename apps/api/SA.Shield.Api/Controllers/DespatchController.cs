using Microsoft.AspNetCore.Mvc;
using SA.Shield.Despatch;
using SA.Shield.Despatch.Models;

namespace SA.Shield.Api.Controllers
{

    [ApiController]
    [Route("[controller]")]
    [Authorise]
    public class DespatchController : ControllerBase
    {
        private readonly ILogger<DespatchController> _logger;
        private readonly DespatchService _despatchService;

        public DespatchController(ILogger<DespatchController> logger)
        {
            _logger = logger;
            _despatchService = new DespatchService();
        }

        [HttpGet]
        [Route("to-be-picked")]
        public List<DespDashboard> GetToBePicked() => _despatchService.GetToBePicked();

        [HttpGet]
        [Route("large-shipments")]
        public List<DespDashboard> GetLargeShipments() => _despatchService.GetLargeShipments();

        [HttpGet]
        [Route("packing")]
        public List<DespDashboard> GetPacking() => _despatchService.GetPacking();

        [HttpGet]
        [Route("completed")]
        public List<DespDashboard> GetCompleted() => _despatchService.GetCompleted();
    }
}
