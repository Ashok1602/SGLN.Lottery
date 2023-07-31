using ACG.SGLN.Lottery.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class DbStorage : IStorage
    {
        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public Task<string> SaveFileAsync(Stream stream, string absolutePath, string fileName)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteFileAsync(string fileAbsolutePath)
        {
            throw new NotImplementedException();
        }

        public Task<Stream> GetFileAsync(string fileAbsolutePath)
        {
            throw new NotImplementedException();
        }

        public Task<List<string>> GetFilesAsync(string absolutePath, string folderRelativePath)
        {
            throw new NotImplementedException();
        }

        public Task<string> CreateFolderAsync(string absolutePath, string folderRelativePath)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteFolderAsync(string absolutePath, string folderRelativePath)
        {
            throw new NotImplementedException();
        }

        public Task<List<string>> GetFoldersAsync(string absolutePath, string folderRelativePath)
        {
            throw new NotImplementedException();
        }
    }
}