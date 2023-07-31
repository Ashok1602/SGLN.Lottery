using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IStorage : IDisposable
    {
        Task<string> SaveFileAsync(Stream stream, string absolutePath, string fileName);

        Task<bool> DeleteFileAsync(string fileAbsolutePath);

        Task<Stream> GetFileAsync(string fileAbsolutePath);

        Task<List<string>> GetFilesAsync(string absolutePath, string folderRelativePath);

        Task<string> CreateFolderAsync(string absolutePath, string folderRelativePath);

        Task<bool> DeleteFolderAsync(string absolutePath, string folderRelativePath);

        Task<List<string>> GetFoldersAsync(string absolutePath, string folderRelativePath);
    }
}