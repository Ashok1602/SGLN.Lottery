using ACG.SGLN.Lottery.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace ACG.SGLN.Lottery.WebUI.Common.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class BufferedFileUpload
    {
        /// <summary>
        /// 
        /// </summary>
        [Required]
        public Guid Id { get; set; }

        /// <summary>
        ///
        /// </summary>
        [Required]
        public DocumentType Type { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public DocumentSpec Spec { get; set; } = DocumentSpec.None;

        /// <summary>
        /// 
        /// </summary>
        [Required]
        public IFormFile File { get; set; }
    }
}
