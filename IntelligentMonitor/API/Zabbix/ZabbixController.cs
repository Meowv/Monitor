using IntelligentMonitor.Providers.Zabbix;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IntelligentMonitor.API.Zabbix
{
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

            var result = zabbix.GetResponseObjectAsync(method, new
            {
                output = "extend",
                filter = new
                {
                    hostid = 10084,
                }
            });
            result.Wait();

            _provider.ZabbixLogout(zabbix);

            return result;
        }
    }
}