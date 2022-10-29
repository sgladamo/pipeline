using Microsoft.AspNetCore.Mvc;
using SA.Shield.Core.Logging;
using SA.Shield.Core.Models;
using SA.Shield.Operations;
using SA.Shield.Operations.Models;

namespace SA.Shield.Api.Controllers.Operations
{
    [ApiController]
    [Route("[controller]")]
    [Authorise]
    public class OperationsController : ControllerBase
    {
        private string RemoteInfo
        {
            get => $"Remote={HttpContext.Connection.RemoteIpAddress}:{HttpContext.Connection.RemotePort}";
        }

        private readonly OperationsService _operationsService = new OperationsService();

        [HttpGet]
        [Route("current-ops")]
        public List<WipCurrentOp> GetCurrentOps(string? job, string? w) => _operationsService.GetCurrentOps(job, w);

        [HttpGet]
        [Route("all-ops")]
        public List<WipJobAllLab> GetAllOps(string? job) => _operationsService.GetAllOps(job);

        [HttpGet]
        [Route("assembly-ops")]
        public List<WipCurrentOp> GetAssemblyOps(string? cell) => _operationsService.GetAssemblyOps(cell);

        [HttpGet]
        [Route("trolley-storage-ops")]
        public List<WipCurrentOp> GetTrolleyStorageOps(string? nextWorkCentreIMachine) => _operationsService.GetTrolleyStorageOps(nextWorkCentreIMachine);

        [HttpGet]
        [Route("picking-ops")]
        public List<WipCurrentOp> GetPickingOps() => _operationsService.GetPickingOps();

        [HttpGet]
        [Route("pick-list")]
        public List<WipJobPickList> GetPickList(string job) => _operationsService.GetPickList(job);

        [HttpGet]
        [Route("boxing-ops")]
        public List<WipCurrentOp> GetBoxingOps() => _operationsService.GetBoxingOps();

        [HttpPut]
        [Route("jobs/{job}/priority")]
        public async Task UpdateJobPriorityAsync(string job, [FromBody] decimal priority)
        {
            Logger.Debug($"Update Capacity Job Priority Requested [/capacity/jobs/{job}]: {RemoteInfo} Priority={priority}");
            await _operationsService.UpdateJobPriorityAsync(job, priority);
        }

        [HttpPut]
        [Route("jobs/{job}/cell")]
        public async Task UpdateJobCellAsync(string job, [FromBody] string cell)
        {
            Logger.Debug($"Update Capacity Job Cell Requested [/capacity/jobs/{job}]: {RemoteInfo} Cell={cell}");
            await _operationsService.UpdateJobCellAsync(job, cell);
        }
    }
}
