using Microsoft.AspNetCore.Mvc;
using SA.Shield.Core.Activation;
using SA.Shield.Core.Logging;

namespace SA.Shield.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ActivationController : Controller
    {
        private string RemoteInfo
        {
            get => $"Remote={HttpContext.Connection.RemoteIpAddress}:{HttpContext.Connection.RemotePort}";
        }

        [HttpGet]
        [Route("state")]
        public ActivationState GetState()
        {
            Logger.Info($"Activation State Requested [/activation/state]: {RemoteInfo}");
            return ActivationService.ActivationState;
        }
    }
}
