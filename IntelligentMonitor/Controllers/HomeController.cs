using IntelligentMonitor.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelligentMonitor.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Back()
        {
            return View();
        }

        [PermissionFilter(Permissions.UserEditor)]
        public IActionResult ChartsEdit()
        {
            return View();
        }
        
        [PermissionFilter(Permissions.UserEditor)]
        public IActionResult Dashboard()
        {
            return View();
        }
    }
}