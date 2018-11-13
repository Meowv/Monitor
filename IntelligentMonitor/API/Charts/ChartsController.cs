using IntelligentMonitor.Models.Charts;
using IntelligentMonitor.Models.JsonResult;
using IntelligentMonitor.Providers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IntelligentMonitor.API.Charts
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
        /// 添加图表
        /// </summary>
        /// <param name="charts"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("add_charts")]
        public JsonResult<string> AddCharts(Models.Charts.Charts charts)
        {
            charts.CreateTime = DateTime.Now;
            charts.IsDelete = 0;
            charts.Seq = 0;

            var code = 0;
            var msg = "保存成功！";

            var entity = _context.Charts.Where(x => x.IsDelete == 0 && x.ItemId == charts.ItemId).FirstOrDefault();
            if (entity != null)
            {
                code = 1;
                msg = "此图表已存在！";
            }
            else
            {
                _context.Charts.Add(charts);
                _context.SaveChanges();
            }

            var result = new JsonResult<string>
            {
                Code = code,
                Count = 0,
                Msg = msg,
                Data = null
            };

            return result;
        }

        /// <summary>
        /// 获取图表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("get_charts")]
        public JsonResult<List<ChartsViewModel>> GetCharts(int count = 0)
        {
            var chartsList = _context.Charts.Where(x => x.IsDelete == 0).OrderByDescending(x => x.Seq).Take(count != 0 ? count : 100).ToList();

            var list = new List<ChartsViewModel>();

            int idx = 1;
            chartsList.ForEach(x =>
            {
                list.Add(new ChartsViewModel()
                {
                    Id = x.Id,
                    ChartsId = "charts" + idx,
                    ChartsName = x.ChartsName,
                    ItemId = x.ItemId,
                    ItemName = x.ItemName,
                    TimeForm = x.TimeFrom,
                    TimeTill = x.TimeTill
                });
                idx++;
            });

            var result = new JsonResult<List<ChartsViewModel>>
            {
                Code = 0,
                Count = list.Count,
                Msg = "success",
                Data = list
            };

            return result;
        }

        /// <summary>
        /// 删除图表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete_charts")]
        public JsonResult<int> DeleteCharts([FromBody]int id)
        {
            var charts = _context.Charts.Where(x => x.Id == id).SingleOrDefault();
            charts.IsDelete = 1;
            _context.Entry(charts).State = EntityState.Modified;
            _context.SaveChanges();

            var result = new JsonResult<int>
            {
                Code = 0,
                Count = 0,
                Msg = "已删除",
                Data = id
            };

            return result;
        }

        /// <summary>
        /// 更新图表排序
        /// </summary>
        /// <param name="chartsId"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("update_charts")]
        public JsonResult<string> UpdateCharts([FromBody]string chartsId)
        {
            var chartsIdArr = chartsId.Split(',');
            for (int i = chartsIdArr.Length, j = 0; i > 0; i--, j++)
            {
                var charts = _context.Charts.Where(x => x.Id == Convert.ToInt32(chartsIdArr[j])).FirstOrDefault();
                charts.Seq = i;

                _context.Entry(charts).State = EntityState.Modified;
                _context.SaveChanges();
            }

            var result = new JsonResult<string>
            {
                Code = 0,
                Count = 0,
                Msg = "success",
                Data = chartsId
            };

            return result;
        }
    }
}