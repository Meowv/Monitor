using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using System.Data;

namespace IntelligentMonitor.Models.AppSettings
{
    public class AppSettings
    {
        public ConnectionStrings ConnectionStrings { get; }

        public AppSettings(IOptions<ConnectionStrings> connectionStrings)
        {
            ConnectionStrings = connectionStrings.Value;
        }

        public IDbConnection MySqlConnection
        {
            get
            {
                return new MySqlConnection(ConnectionStrings.MySqlConnection);
            }
        }
    }
}