using System.Collections.Generic;

namespace IntelligentMonitor.Models.Users
{
    public class Users
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string NickName { get; set; }

        public string Password { get; set; }

        public int RoleId { get; set; }
        public string RoleName { get; set; }

        public int IsDelete { get; set; }

        public List<Permission> Permissions { get; set; }
    }
}