namespace IntelligentMonitor.Models.Users
{
    public class Permissions
    {
        public int Id { get; set; }

        public int RoleId { get; set; }

        public string PermissionName { get; set; }

        public string PermissionDescribe { get; set; }
    }
}