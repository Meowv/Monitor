using Microsoft.AspNetCore.Authorization;

namespace IntelligentMonitor.Authorization
{
    public class PermissionAuthorizationRequirement : IAuthorizationRequirement
    {
        public string Name { get; set; }

        public PermissionAuthorizationRequirement(string name)
        {
            Name = name;
        }
    }
}