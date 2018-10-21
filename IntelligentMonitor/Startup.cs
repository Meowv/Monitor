using IntelligentMonitor.Models.AppSettings;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
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
            services
                .AddOptions()
                .Configure<AppSettings>(Configuration)
                .Configure<ConnectionStrings>(Configuration.GetSection("MySqlConnection"))
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