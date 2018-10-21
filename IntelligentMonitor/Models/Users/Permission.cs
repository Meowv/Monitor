namespace IntelligentMonitor.Models.Users
{
    public class Permission
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string PermissionName { get; set; }
    }
}