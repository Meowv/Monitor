using IntelligentMonitor.Models.Users;
using IntelligentMonitor.Providers.Users;
using IntelligentMonitor.Utility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IntelligentMonitor.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserProvider _provider;

        public AccountController(UserProvider provider)
        {
            _provider = provider;
        }

        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel vm)
        {
            if (ModelState.IsValid)
            {
                var user = _provider.GetUser(vm.UserName, vm.Password);
                if (user == null)
                {
                    return Json(new { code = 1, msg = "账号或密码错误！" });
                }
                else
                {
                    var claimIdentity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                    claimIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
                    claimIdentity.AddClaim(new Claim(ClaimTypes.Name, user.NickName));
                    claimIdentity.AddClaim(new Claim(ClaimTypes.Role, user.RoleName));

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimIdentity));
                }
            }

            return Json(new { code = 0, msg = "登录成功！" });
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        public IActionResult Profile()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Profile(Users user)
        {
            int code = await _provider.UpdateUser(user);

            return code > 0 ? Json(new { code = 0, msg = "修改成功！" }) : Json(new { code = 1, msg = "请稍后再试！" });
        }

        public IActionResult Password()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Password(Users user)
        {
            user.Password = MD5Util.TextToMD5(user.Password);

            int code = await _provider.UpdateUser(user);

            return code > 0 ? Json(new { code = 0, msg = "修改成功！" }) : Json(new { code = 1, msg = "请稍后再试！" });
        }
    }
}