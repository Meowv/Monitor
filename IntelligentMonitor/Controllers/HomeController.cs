using IntelligentMonitor.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelligentMonitor.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [PermissionFilter(Permissions.UserRead)]
        public IActionResult Index()
        {
            return View();
        }

        [PermissionFilter(Permissions.UserCreate)]
        [PermissionFilter(Permissions.UserDelete)]
        [PermissionFilter(Permissions.UserUpdate)]
        public IActionResult Back()
        {
            return View();
        }
    }
}