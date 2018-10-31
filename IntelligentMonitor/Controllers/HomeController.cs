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

        public IActionResult ChartsEdit()
        {
            return View();
        }
    }
}