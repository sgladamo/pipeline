using Microsoft.AspNetCore.Mvc;
using SA.Shield.Core.Logging;
using SA.Shield.Operations;

namespace SA.Shield.Api.Controllers.Operations
{
    [Route("kpi/operations")]
    [ApiController]
    [Authorise]
    public class OperationsKPIController : ControllerBase
    {
        private readonly OperationsKPIService _service = new OperationsKPIService();

        [HttpGet]
        [Route("items")]
        public int GetTotalItems([FromQuery] string workCentre, [FromQuery] string from, [FromQuery] string to, [FromQuery] string? type = null)
        {
            var fromDateTime = DateTime.Parse(from);

            if (fromDateTime.Hour == 23)
            {
                fromDateTime = fromDateTime.AddHours(1);
            }

            var toDateTime = DateTime.Parse(to);
            var remoteInfo = $"Remote={HttpContext.Connection.RemoteIpAddress}:{HttpContext.Connection.RemotePort}";
            Logger.Debug($"Total Items Requested [/kpi/operations/items]: {remoteInfo} WorkCentre={workCentre} From={from} To={to} Type={type}");
            return _service.GetTotalItems(workCentre, fromDateTime, toDateTime, type);
        }

        [HttpGet]
        [Route("items/forecast")]
        public int GetForecastItems([FromQuery] string date, [FromQuery] string? type = null)
        {
            var dateTime = DateTime.Parse(date);
            var remoteInfo = $"Remote={HttpContext.Connection.RemoteIpAddress}:{HttpContext.Connection.RemotePort}";
            Logger.Info($"Total Items Requested [/kpi/operations/items]: {remoteInfo} Date={date} Type={type} DateTime={dateTime}");
            return _service.GetForecastItems(dateTime, type);
        }
    }
}
