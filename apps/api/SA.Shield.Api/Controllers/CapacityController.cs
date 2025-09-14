using Microsoft.AspNetCore.Mvc;
using SA.Shield.Core.Logging;
using SA.Shield.Capacity;
using SA.Shield.Capacity.Models;

namespace SA.Shield.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorise]
    public class CapacityController : Controller
    {
        private readonly CapacityService _capacityService = new CapacityService();

        private string RemoteInfo
        {
            get => $"Remote={HttpContext.Connection.RemoteIpAddress}:{HttpContext.Connection.RemotePort}";
        }

        [HttpGet]
        [Route("days/{cell}")]
        public List<CapacityDay> GetCellCapacityDays(string cell, [FromQuery] string from, [FromQuery] string to)
        {
            var fromDateTime = DateTime.Parse(from);
            var toDateTime = DateTime.Parse(to);
            Logger.Debug($"Capacity Days Requested [/capacity/days]: {RemoteInfo} Cell={cell} From={from} To={to}");
            return _capacityService.GetCellCapacityDays(cell, fromDateTime, toDateTime);
        }

        [HttpGet]
        [Route("days")]
        public Dictionary<string, List<CapacityDay>> GetAllCapacityDays([FromQuery] string from, [FromQuery] string to)
        {
            var fromDateTime = DateTime.Parse(from);
            var toDateTime = DateTime.Parse(to);
            Logger.Debug($"Capacity Days Requested [/capacity/days]: {RemoteInfo} From={from} To={to}");
            return _capacityService.GetAllCapacityDays(fromDateTime, toDateTime);
        }

        [HttpPut]
        [Route("days/{capacityDayId}")]
        public void UpdateCapacityDay(string capacityDayId, [FromBody] double hours)
        {
            Logger.Debug($"Update Capacity Day Requested [/capacity/days/{capacityDayId}]: {RemoteInfo} ID={capacityDayId} Hours={hours}");
            _capacityService.UpdateCapacityDay(capacityDayId, hours);
        }

        [HttpPut]
        [Route("jobs/{capacityJobId}/shift/{capacityDayId}/{index}")]
        public async Task ShiftCapacityJob(string capacityJobId, string capacityDayId, int index)
        {
            Logger.Debug($"Shift Capacity Job Requested [/capacity/jobs/{capacityJobId}/shift/{capacityDayId}/{index}]: {RemoteInfo} CapacityJobId={capacityJobId} CapacityDayId={capacityDayId} Index={index}");
            await _capacityService.ShiftCapacityJob(capacityJobId, capacityDayId, index);
        }

        [HttpPut]
        [Route("jobs/{job}/priority")]
        public async Task UpdateJobPriorityAsync(string job, [FromBody] decimal priority)
        {
            Logger.Debug($"Update Capacity Job Priority Requested [/capacity/jobs/{job}]: {RemoteInfo} Priority={priority}");
            await _capacityService.UpdateJobPriority(job, priority);
        }

        [HttpPut]
        [Route("jobs/{job}/cell")]
        public async Task UpdateJobCellAsync(string job, [FromBody] string cell)
        {
            Logger.Debug($"Update Capacity Job Cell Requested [/capacity/jobs/{job}]: {RemoteInfo} Cell={cell}");
            await _capacityService.UpdateJobCell(job, cell);
        }

        [HttpGet]
        [Route("lost-hours/{date}")]
        public CapacityLostHours GetLostHours(string date)
        {
            var dateObject = DateTime.Parse(date);

            if (dateObject.Hour == 23)
            {
                dateObject = dateObject.AddHours(1);
            }

            Logger.Info($"Get Lost Hours Requested [/capacity/lost-hours]: {RemoteInfo} Date={date} DateObject={dateObject}");
            return _capacityService.GetLostHours(dateObject);
        }

        [HttpPut]
        [Route("lost-hours/{date}")]
        public async Task UpdateLostHours(string date, [FromBody] CapacityLostHours capacityLostHours)
        {
            var dateObject = DateTime.Parse(date);
            if (dateObject.Hour == 23)
            {
                dateObject = dateObject.AddHours(1);
            }

            Logger.Info($"Update Lost Hours Requested [/capacity/lost-hours]: {RemoteInfo} Date={capacityLostHours.Date} Quality={capacityLostHours.Quality} Other={capacityLostHours.Other} DateObject={dateObject}");

            await _capacityService.UpdateLostHours(dateObject, capacityLostHours);
        }
    }
}
