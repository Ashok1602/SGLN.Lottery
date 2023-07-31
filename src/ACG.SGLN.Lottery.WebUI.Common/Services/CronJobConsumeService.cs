using Cronos;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Timer = System.Timers.Timer;

namespace ACG.SGLN.Lottery.WebUI.Common.Services
{
    public class CronJobConsumeService : IHostedService, IDisposable
    {
        public IServiceProvider Services { get; }
        public CronExpression Expression { get; }
        public TimeZoneInfo TimeZoneInfo { get; }
        public Timer Timer { get; set; }

        public CronJobConsumeService(IServiceProvider services, IScheduleConfig<CronJobConsumeService> config)
        {
            Services = services;
            Expression = CronExpression.Parse(config.CronExpression);
            TimeZoneInfo = config.TimeZoneInfo;
        }

        public virtual async Task StartAsync(CancellationToken cancellationToken)
        {
            await ScheduleJob(cancellationToken);
        }

        protected virtual async Task ScheduleJob(CancellationToken cancellationToken)
        {
            var next = Expression.GetNextOccurrence(DateTimeOffset.Now, TimeZoneInfo);
            if (next.HasValue)
            {
                var delay = next.Value - DateTimeOffset.Now;
                if (delay.TotalMilliseconds <= 0) // prevent non-positive values from being passed into Timer
                {
                    await ScheduleJob(cancellationToken);
                }

                Timer = new Timer(delay.TotalMilliseconds);
                Timer.Elapsed += async (sender, args) =>
                {
                    Timer.Dispose(); // reset and dispose timer
                    Timer = null;

                    if (!cancellationToken.IsCancellationRequested)
                    {
                        using (var scope = Services.CreateScope())
                        {
                            var jobs = scope.ServiceProvider.GetServices<IScopedProcessingService>();
                            foreach (var job in jobs)
                            {
                                await job.DoWorkAsync(cancellationToken);
                            }
                        }
                    }

                    if (!cancellationToken.IsCancellationRequested)
                    {
                        await ScheduleJob(cancellationToken); // reschedule next
                    }
                };

                Timer.Start();
            }

            await Task.CompletedTask;
        }

        public virtual async Task StopAsync(CancellationToken cancellationToken)
        {
            Timer?.Stop();
            await Task.CompletedTask;
        }

        public virtual void Dispose()
        {
            Timer?.Dispose();
        }
    }

    public interface IScheduleConfig<T>
    {
        string CronExpression { get; set; }
        TimeZoneInfo TimeZoneInfo { get; set; }
    }

    public class ScheduleConfig<T> : IScheduleConfig<T>
    {
        public string CronExpression { get; set; }
        public TimeZoneInfo TimeZoneInfo { get; set; }
    }

    public static class ScheduledServiceExtensions
    {
        public static IServiceCollection AddCronJob<T>(this IServiceCollection services,
            Action<IScheduleConfig<T>> options) where T : class
        {
            if (options == null)
            {
                throw new ArgumentNullException(nameof(options), @"Please provide Schedule Configurations.");
            }

            var config = new ScheduleConfig<T>();
            options.Invoke(config);
            if (string.IsNullOrWhiteSpace(config.CronExpression))
            {
                throw new ArgumentNullException(nameof(ScheduleConfig<T>.CronExpression),
                    @"Empty Cron Expression is not allowed.");
            }

            services.AddSingleton<IScheduleConfig<T>>(config);
            //services.AddScoped<ICurrentUserService, CronJobCurrentUserService>();
            services.AddHostedService<CronJobConsumeService>();
            return services;
        }
    }
}