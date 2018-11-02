using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IntelligentMonitor.Areas.Zabbix
{
    using IntelligentMonitor.Providers.Zabbix;
    using ZabbixAPICore;

    [Route("api/[controller]")]
    [ApiController]
    public class ZabbixController : ControllerBase
    {
        private readonly ZabbixProvider _provider;

        public ZabbixController(ZabbixProvider provider)
        {
            _provider = provider;
        }

        /// <summary>
        /// 自定义method，返回Zabbix数据
        /// </summary>
        /// <param name="method"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get_zabbix")]
        public Task<Response> GetZabbix(string method)
        {
            var zabbix = _provider.ZabbixLogin();

            var result = zabbix.GetResponseObjectAsync(method, new { });
            result.Wait();

            _provider.ZabbixLogout(zabbix);

            return result;
        }
    }
}