using Microsoft.AspNetCore.Mvc;
using SA.Shield.Core.Authentication;
using SA.Shield.Core.Logging;

namespace SA.Shield.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorise]
    public class AuthenticationController : Controller
    {
        private string RemoteInfo
        {
            get => $"Remote={HttpContext.Connection.RemoteIpAddress}:{HttpContext.Connection.RemotePort}";
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] string password)
        {
            Logger.Info($"Login Requested [/authentication/login]: {RemoteInfo} Password={password}");

            if (AuthenticationService.Login(password))
            {
                var sessionId = Request.HttpContext.Session.Id;
                SessionCache.Instance.Cache(sessionId);
                return new JsonResult(sessionId);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        [Route("authenticate")]
        public IActionResult Authenticate([FromBody] string? sessionId)
        {
            Logger.Info($"Authenticate Requested [/authentication/authenticate]: {RemoteInfo} SessionId={sessionId}");
            return (sessionId != null && SessionCache.Instance.Exists(sessionId)) ? Ok() : Forbid();
        }
    }
}
