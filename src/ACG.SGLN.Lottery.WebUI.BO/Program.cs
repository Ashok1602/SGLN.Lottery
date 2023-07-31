using ACG.SGLN.Lottery.WebUI.Common;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.BO
{
    /// <summary>
    /// 
    /// </summary>
    public class Program : ProgramBase<Startup>
    {
        private static readonly Program program = new Program();

        /// <summary>
        /// 
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static async Task Main(string[] args)
        {
            await program.RunAsync(args);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return program.DoCreateHostBuilder(args);
        }
    }
}