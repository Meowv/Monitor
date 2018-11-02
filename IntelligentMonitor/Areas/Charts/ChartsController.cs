using IntelligentMonitor.Models.JsonResult;
using IntelligentMonitor.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace IntelligentMonitor.Areas.Charts
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChartsController : ControllerBase
    {
        private readonly IntelligentMonitorContext _context;

        public ChartsController(IntelligentMonitorContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 展示的图表Id
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get_chartsid")]
        public JsonResult<string[]> GetChartsId()
        {
            var value = _context.ChartsDics.Where(x => x.Key == "chartsId").SingleOrDefault().Value;

            var result = new JsonResult<string[]>
            {
                Code = 0,
                Count = 0,
                Msg = "success",
                Data = value.Split(',').Take(6).ToArray()
            };

            return result;
        }

        /// <summary>
        /// 更新展示的图表Id
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("chartsid")]
        public JsonResult<string> UpdateChartsId([FromBody]string value)
        {
            var charts = _context.ChartsDics.Where(x => x.Key == "chartsId").SingleOrDefault();
            charts.Value = value;
            _context.Entry(charts).State = EntityState.Modified;
            _context.SaveChanges();

            var result = new JsonResult<string>
            {
                Code = 0,
                Count = 0,
                Msg = "success",
                Data = value
            };

            return result;
        }
    }
}