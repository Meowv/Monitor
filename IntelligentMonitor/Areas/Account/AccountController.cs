using IntelligentMonitor.Models.JsonResult;
using IntelligentMonitor.Models.Users;
using IntelligentMonitor.Providers.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IntelligentMonitor.Areas.Account
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly UserProvider _provider;

        public AccountController(UserProvider provider)
        {
            _provider = provider;
        }

        /// <summary>
        /// 用户列表
        /// </summary>
        /// <param name="role">1/0</param>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="userName"></param>
        /// <param name="roleId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("get_users")]
        public JsonResult<List<Users>> GetUserList(int role, int page, int limit, string userName = null, string roleId = null)
        {
            var list = _provider.GetUserList();
            if (role == 1)
            {
                list = list.Where(u => u.RoleId == 10000).ToList();
            }
            else
            {
                list = list.Where(u => u.RoleId != 10000).ToList();
            }

            if (!string.IsNullOrEmpty(roleId))
            {
                list = list.Where(u => u.RoleId == Convert.ToUInt32(roleId)).ToList();
            }

            if (!string.IsNullOrEmpty(userName))
            {
                list = list.Where(u => u.UserName == userName).ToList();
            }

            var curList = list.Skip(limit * (page - 1)).Take(limit).ToList();

            var result = new JsonResult<List<Users>>
            {
                Code = 0,
                Count = list.Count,
                Msg = "success",
                Data = curList
            };

            return result;
        }
    }
}