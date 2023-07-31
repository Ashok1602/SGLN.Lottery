using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class LocalStorage : IStorage
    {
        private readonly NfsOptions _nfsOptions;
        public LocalStorage(IOptions<NfsOptions> nfsOptions)
        {
            _nfsOptions = nfsOptions.Value;
        }

        public Task<string> SaveFileAsync(Stream stream, string absolutePath, string fileName)
        {
            absolutePath = Path.Combine(_nfsOptions.MountDir, absolutePath.Trim());
            if (!Directory.Exists(absolutePath.Trim()))
                Directory.CreateDirectory(absolutePath.Trim());

            var filePath = Path.Combine(absolutePath, fileName.Trim());
            using (var fileStream = File.Create(filePath))
            {
                stream.Position = 0;
                stream.CopyTo(fileStream);
                return Task.FromResult(filePath);
            }
        }

        public Task<bool> DeleteFileAsync(string fileAbsolutePath)
        {
            fileAbsolutePath = Path.Combine(_nfsOptions.MountDir, fileAbsolutePath.Trim());
            if (File.Exists(fileAbsolutePath)) File.Delete(fileAbsolutePath);

            return Task.FromResult(true);
        }

        public Task<Stream> GetFileAsync(string fileAbsolutePath)
        {
            fileAbsolutePath = Path.Combine(_nfsOptions.MountDir, fileAbsolutePath.Trim());
            if (File.Exists(fileAbsolutePath))
            {
                var stream = new StreamReader(fileAbsolutePath).BaseStream;
                stream.Position = 0;

                return Task.FromResult(stream);
            }
            return null;
        }

        public Task<List<string>> GetFilesAsync(string absolutePath, string folderRelativePath)
        {
            absolutePath = Path.Combine(_nfsOptions.MountDir, absolutePath.Trim());
            if (Directory.Exists(Path.Combine(absolutePath, folderRelativePath.Trim())))
                return Task.FromResult(Directory.GetFiles(Path.Combine(absolutePath, folderRelativePath.Trim()))
                    .ToList());

            return null;
        }

        public Task<string> CreateFolderAsync(string absolutePath, string folderRelativePath)
        {
            absolutePath = Path.Combine(_nfsOptions.MountDir, absolutePath.Trim());
            return Task.FromResult(Path.Combine(absolutePath, folderRelativePath.Trim()));
        }

        public Task<bool> DeleteFolderAsync(string absolutePath, string folderRelativePath)
        {
            absolutePath = Path.Combine(_nfsOptions.MountDir, absolutePath.Trim());
            if (Directory.Exists(Path.Combine(absolutePath, folderRelativePath.Trim())))
                Directory.Delete(Path.Combine(absolutePath, folderRelativePath.Trim()), true);

            return Task.FromResult(true);
        }

        public Task<List<string>> GetFoldersAsync(string absolutePath, string folderRelativePath)
        {
            absolutePath = Path.Combine(_nfsOptions.MountDir, absolutePath.Trim());
            if (Directory.Exists(Path.Combine(absolutePath, folderRelativePath.Trim())))
                return Task.FromResult(Directory
                    .GetDirectories(Path.Combine(absolutePath, folderRelativePath.Trim())).ToList());

            return null;
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}