using Dapper;
using IntelligentMonitor.Models.AppSettings;
using IntelligentMonitor.Models.Charts;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace IntelligentMonitor.Providers.Charts
{
    public class ChartsProvider
    {
        private readonly AppSettings _settings;

        public ChartsProvider(AppSettings settings)
        {
            _settings = settings;
        }
    }
}