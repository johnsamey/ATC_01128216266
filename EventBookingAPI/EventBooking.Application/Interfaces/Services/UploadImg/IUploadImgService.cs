using Microsoft.AspNetCore.Http;

namespace EventBooking.Application.Interfaces.Services.UploadImg;

public interface IUploadImgService
{
    Task<string> UploadImgUrlAsync(IFormFile img);
    Task<string> UpdateImg(string FolderName, IFormFile Newimg, string OldPath);
    void deleteImg(string OldPath);
}