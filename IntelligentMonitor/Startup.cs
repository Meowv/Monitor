using IntelligentMonitor.Authorization;
using IntelligentMonitor.Models.AppSettings;
using IntelligentMonitor.Providers;
using IntelligentMonitor.Providers.Users;
using IntelligentMonitor.Providers.Zabbix;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Text.Encodings.Web;
using System.Text.Unicode;

namespace IntelligentMonitor
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddCookie();
            services
                .AddOptions()
                .Configure<AppSettings>(Configuration)
                .Configure<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"))
                .Configure<ZabbixConfig>(Configuration.GetSection("ZabbixConfig"))
                .AddDbContext<IntelligentMonitorContext>(options => options.UseMySql(Configuration.GetConnectionString("MySqlConnection")))
                .AddDbContext<ZabbixContext>(options => options.UseMySql(Configuration.GetConnectionString("ZabbixConnection")))
                .AddSwaggerGen(s =>
                {
                    s.SwaggerDoc("IntelligentMonitor", null);
                    s.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "IntelligentMonitor.xml"));
                })
                .AddRouting(routes =>
                {
                    routes.LowercaseUrls = true;
                    routes.AppendTrailingSlash = false;
                })
                .AddSingleton(HtmlEncoder.Create(UnicodeRanges.All))
                .AddSingleton<AppSettings>()
                .AddTransient<IAuthorizationHandler, PermissionAuthorizationHandler>()
                .AddTransient<UserProvider>()
                .AddTransient<ZabbixProvider>()
                .AddResponseCaching()
                .AddMvc(options => {
                    options.CacheProfiles.Add("ZabbixAPI", new CacheProfile()
                    {
                        Duration = 10
                    });
                    options.CacheProfiles.Add("ChartsAPI", new CacheProfile()
                    {
                        Duration = 3
                    });
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseResponseCaching();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            app.UseSwagger();
            app.UseSwaggerUI(s =>
            {
                s.SwaggerEndpoint("/swagger/IntelligentMonitor/swagger.json", "IntelligentMonitor API");
            });
        }
    }
}