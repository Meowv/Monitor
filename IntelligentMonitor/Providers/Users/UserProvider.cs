using Dapper;
using IntelligentMonitor.Models.AppSettings;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace IntelligentMonitor.Providers.Users
{
    using IntelligentMonitor.Models.Users;
    using IntelligentMonitor.Utility;

    public class UserProvider
    {
        private readonly AppSettings _settings;
        private readonly IntelligentMonitorContext _context;

        public UserProvider(AppSettings settings, IntelligentMonitorContext context)
        {
            _settings = settings;
            _context = context;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public Users GetUser(int Id)
        {
            var sql = @"SELECT
	                    u.Id,
	                    u.UserName,
	                    u.NickName,
	                    u.PASSWORD,
	                    u.RoleId,
	                    r.RoleName 
                    FROM
	                    users AS u
	                    JOIN roles AS r ON u.RoleId = r.Id 
                    WHERE
                        u.IsDelete = 0
	                    AND u.Id = @Id";
            using (IDbConnection conn = _settings.MySqlConnection)
            {
                var list = new List<Permission>();

                var user = conn.Query<Users>(sql, new { Id }).FirstOrDefault();

                var permissionList = _context.Permission.Where(p => p.RoleId == user.RoleId).ToList();
                permissionList.ForEach(x =>
                {
                    list.Add(new Permission { UserId = user.Id, PermissionName = x.PermissionName });
                });
                user.Permissions = list;

                return user;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Users GetUser(string username, string password)
        {
            return _context.Users.FirstOrDefault(u => u.UserName == username && u.Password == MD5Util.TextToMD5(password) && u.IsDelete == 0);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="permissionName"></param>
        /// <returns></returns>
        public bool CheckPermission(int Id, string permissionName)
        {
            var user = GetUser(Id);
            if (user == null)
            {
                return false;
            }
            return user.Permissions.Any(p => permissionName.StartsWith(p.PermissionName));
        }
    }
}