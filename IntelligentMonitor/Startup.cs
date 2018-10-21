using IntelligentMonitor.Authorization;
using IntelligentMonitor.Models.AppSettings;
using IntelligentMonitor.Providers;
using IntelligentMonitor.Providers.Users;
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
                .AddDbContext<IntelligentMonitorContext>(options => options.UseMySql(Configuration.GetConnectionString("MySqlConnection")))
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
                .AddSingleton<AppSettings>()
                .AddSingleton<UserProvider>()
                .AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>()
                .AddMvc()
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