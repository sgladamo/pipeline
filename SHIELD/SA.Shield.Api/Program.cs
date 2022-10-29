using SA.Shield.Core.Logging;
using SA.Shield.Capacity;
using SA.Shield.Core.Activation;
using SA.Shield.Core.Authentication;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

// Configuring logging provider
builder.Host.ConfigureLogging(builder => builder.ClearProviders().AddColorConsoleLogger());

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthorization();
app.UseSession();
app.MapControllers();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
LoggerSingleton.Instance.ILogger = logger;

var activationService = new ActivationService();
activationService.GenerateActivationCode();

var capacityService = new CapacityService();
capacityService.InitialiseCapacityTables();
capacityService.StartUpdater();

Logger.Info("Starting Session Manager");
System.Timers.Timer sessionManager = new System.Timers.Timer();
sessionManager.Interval = 60000;
sessionManager.Elapsed += (s, e) => SessionCache.Instance.Clean();
sessionManager.Start();

app.Run();