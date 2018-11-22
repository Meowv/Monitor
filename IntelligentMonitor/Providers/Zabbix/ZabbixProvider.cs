using IntelligentMonitor.Models.AppSettings;
using Microsoft.Extensions.Options;

namespace IntelligentMonitor.Providers.Zabbix
{
    using ZabbixAPICore;

    public class ZabbixProvider
    {
        private readonly ZabbixConfig _zabbix;
        private readonly AppSettings _settings;

        public ZabbixProvider(IOptions<ZabbixConfig> zabbix , AppSettings settings)
        {
            _zabbix = zabbix.Value;
            _settings = settings;
        }

        /// <summary>
        /// 登入
        /// </summary>
        /// <returns></returns>
        public Zabbix ZabbixLogin()
        {
            var zabbix = new Zabbix(_zabbix.User, _zabbix.Password, _zabbix.Url);
            zabbix.LoginAsync().Wait();

            return zabbix;
        }

        /// <summary>
        /// 登出
        /// </summary>
        /// <param name="zabbix"></param>
        public void ZabbixLogout(Zabbix zabbix)
        {
            zabbix.LogoutAsync().Wait();
        }
    }
}