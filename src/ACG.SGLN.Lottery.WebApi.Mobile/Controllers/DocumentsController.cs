using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Application.RefData.Queries;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebApi.Mobile.Controllers
{
    /// <summary>
    /// Document upload/download
    /// </summary>
    [Route("[controller]")]
    public class DocumentsController : Controller
    {
        private IMediator _mediator;

        /// <summary>
        /// 
        /// </summary>
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();


        /// <summary>
        /// Download a document
        /// </summary>
        /// <param name="type"></param>
        /// <param name="id"></param>
        /// <param name="isThumbnail"></param>
        /// <returns></returns>
        [HttpGet("Download/{type}/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Download(DocumentType type, Guid id, [FromQuery] bool isThumbnail = false)
        {
            AbstractDocument document = await Mediator.Send(new DownloadQuery() { Type = type, Id = id, IsThumbnail = isThumbnail, IsWebP = false });
            if (document != null && document.Data != null)
            {
                return GetDocument(document.Data, /*isWebP ? "image/webp" :*/ document.MimeType);
            }

            return File("~/placeholder-generic.png", "image/png");
        }

        /// <summary>
        /// Download static documents by Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet("Download/RequestNature/{type}")]
        [AllowAnonymous]
        public async Task<IActionResult> DownloadRequestNatureImage(RequestNatureType type)
        {
            try
            {
                return File($"~/assets/RequestNatures/{Enum.GetName(typeof(RequestNatureType), type)}.png", "image/png");
            }
            catch (Exception) //TODO refractor
            { }
            return File("~/placeholder-generic.png", "image/png");
        }


        /// <summary>
        /// Download static documents by Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet("Download/IncentiveCategory/{type}")]
        [AllowAnonymous]
        public async Task<IActionResult> DownloadIncentiveCategoryImage(GameType type)
        {
            try
            {
                return File($"~/assets/IncentiveCategories/{Enum.GetName(typeof(GameType), type)}.png", "image/png");
            }
            catch (Exception) //TODO refractor
            { }
            return File("~/placeholder-generic.png", "image/png");
        }

        /// <summary>
        /// Get application documents
        /// </summary>
        /// <returns></returns>
        [HttpGet("AppDocuments")]
        [AllowAnonymous]
        public async Task<ActionResult<List<DocumentDto>>> GetApplicationDocuments([FromBody] DocumentType? documentType)
        {
            return await Mediator.Send(new GetApplicationDocumentsQuery() { Type = documentType });
        }

        private ActionResult GetDocument(byte[] data, string mimeType)
        {
            if (data != null && data.Length > 0)
            {
                Response.Headers["Cache-Control"] = $"public,max-age=86400";

                return File(data, mimeType);
            }

            return File("~/placeholder-generic.png", "image/png");
        }


        //TODO : move to common
        private ActionResult GetThumbnail(byte[] data, string mimeType)
        {
            if (!mimeType.StartsWith("image/"))
                return File("~/placeholder-generic.png", "image/png");

            using (var stream = new MemoryStream(data))
            {
                Size size = ResizeKeepAspect(new Size(640, 360), 640, 360);
                Image image = Image.FromStream(stream);
                Image thumb = image.GetThumbnailImage(size.Width, size.Height, () => false, IntPtr.Zero);

                using (var ms = new MemoryStream())
                {
                    thumb.Save(ms, ImageFormat.Png);

                    return File(ms.ToArray(), "image/png");
                }
            }
        }

        //TODO : move to common
        private Size ResizeKeepAspect(Size src, int maxWidth, int maxHeight, bool enlarge = false)
        {
            maxWidth = enlarge ? maxWidth : Math.Min(maxWidth, src.Width);
            maxHeight = enlarge ? maxHeight : Math.Min(maxHeight, src.Height);

            decimal rnd = Math.Min(maxWidth / (decimal)src.Width, maxHeight / (decimal)src.Height);
            return new Size((int)Math.Round(src.Width * rnd), (int)Math.Round(src.Height * rnd));
        }

    }
}
