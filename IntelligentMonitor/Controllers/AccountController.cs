using IntelligentMonitor.Models.Users;
using IntelligentMonitor.Providers.Users;
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
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel vm, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                var user = _provider.GetUser(vm.UserName, vm.Password);
                if (user == null)
                {
                    ModelState.AddModelError(string.Empty, "用户名或密码错误！");
                    return View(vm);
                }
                else
                {
                    var claimIdentity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
                    claimIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
                    claimIdentity.AddClaim(new Claim(ClaimTypes.Name, user.NickName));
                    claimIdentity.AddClaim(new Claim(ClaimTypes.Role, user.RoleName));

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimIdentity));

                    if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    return RedirectToAction(nameof(HomeController.Index), "Home");
                }
            }

            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return RedirectToAction(nameof(AccountController.Login), "Login");
        }
    }
}