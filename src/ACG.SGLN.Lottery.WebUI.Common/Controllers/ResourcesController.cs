using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers
{
    /// <summary>
    /// Resources values/description
    /// </summary>
    public class ResourcesController : ApiController
    {
        /// <summary>
        /// Resources values/description list
        /// </summary>
        /// <returns></returns>
        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<IDictionary<string, IDictionary<string, string>>> Get()
        {
            var assembly = typeof(DocumentType).Assembly;
            var enums = assembly.GetTypes().Where(e => e.IsSubclassOf(typeof(Enum)));
            var method = typeof(ResourcesController).GetTypeInfo().DeclaredMethods
                .Single(m => m.Name == nameof(GetEnumValues));

            var resources = new Dictionary<string, IDictionary<string, string>>();

            foreach (Type type in enums)
            {
                resources.Add(type.Name, (IDictionary<string, string>)method.MakeGenericMethod(type).Invoke(this, new[] { type }));
            }

            resources.Add("RoleTranslations", SeedData.RolesTranslations);

            return Ok(resources);
        }

        private IDictionary<string, string> GetEnumValues<T>(Type type) where T : Enum
        {
            return Enum.GetValues(type).Cast<T>().ToDictionary(e => e.ToString(), e => e.GetDescription());
        }

    }
}
