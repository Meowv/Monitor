using IntelligentMonitor.Providers.Zabbix;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IntelligentMonitor.API.Zabbix
{
    using IntelligentMonitor.Utility;
    using System;
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
        /// Group
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("hostgroup")]
        public Task<Response> GetHostGroup()
        {
            var zabbix = _provider.ZabbixLogin();

            var result = zabbix.GetResponseObjectAsync("hostgroup.get", new
            {
                output = new string[] { "groupid", "name" },
                real_hosts = true,
                sortfield = "name",
            });
            result.Wait();

            _provider.ZabbixLogout(zabbix);

            return result;
        }

        /// <summary>
        /// Host
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("host")]
        public Task<Response> GetHost(string[] groupids)
        {
            var zabbix = _provider.ZabbixLogin();

            var result = zabbix.GetResponseObjectAsync("host.get", new
            {
                groupids,
                output = new string[] { "name", "host" },
                sortfield = "name"
            });
            result.Wait();

            _provider.ZabbixLogout(zabbix);

            return result;
        }

        /// <summary>
        /// Application
        /// </summary>
        /// <param name="hostids"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("application")]
        public Task<Response> GetApplication(string[] hostids)
        {
            var zabbix = _provider.ZabbixLogin();

            var result = zabbix.GetResponseObjectAsync("application.get", new
            {
                hostids,
                output = "extend"
            });
            result.Wait();

            _provider.ZabbixLogout(zabbix);

            return result;
        }

        /// <summary>
        /// Item
        /// </summary>
        /// <param name="applicationids"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("item")]
        public Task<Response> GetItem(string[] applicationids)
        {
            var zabbix = _provider.ZabbixLogin();

            var result = zabbix.GetResponseObjectAsync("item.get", new
            {
                applicationids,
                filter = new
                {
                    value_type = new int[] { 0, 3 }
                },
                output = new string[] { "name", "key_", "value_type", "hostid", "status", "state" },
                selectHosts = new string[] { "hostid", "name" },
                sortfield = "name",
                webitems = true
            });
            result.Wait();

            _provider.ZabbixLogout(zabbix);

            return result;
        }

        /// <summary>
        /// History
        /// </summary>
        /// <param name="itemids"></param>
        /// <param name="time_from"></param>
        /// <param name="time_till"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("history")]
        public Task<Response> GetHsitory(string[] itemids, string time_from = null, string time_till = null)
        {
            long start_time;
            long end_time;

            if (string.IsNullOrEmpty(time_from) || string.IsNullOrEmpty(time_till))
            {
                var now = DateTime.Now;
                end_time = DatetimeUtil.TimeToUnix(now);
                start_time = DatetimeUtil.TimeToUnix(now.AddHours(-1));
            }
            else
            {
                start_time = DatetimeUtil.TimeToUnix(Convert.ToDateTime(time_from));
                end_time = DatetimeUtil.TimeToUnix(Convert.ToDateTime(time_till));
            }

            var zabbix = _provider.ZabbixLogin();

            var result = zabbix.GetResponseObjectAsync("history.get", new
            {
                history = "0",
                itemids,
                output = "extend",
                sortfield = "clock",
                sortorder = "ASC",
                time_from = start_time,
                time_till = end_time
            });
            result.Wait();

            _provider.ZabbixLogout(zabbix);

            return result;
        }
    }
}