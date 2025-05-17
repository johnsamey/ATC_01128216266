using System.Diagnostics;
using EventBooking.Application.Interfaces.Services.UploadImg;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace EventBooking.Application.Services.UploadImg;

public class UploadImgService: IUploadImgService
{
    private readonly IWebHostEnvironment iWebHostEnvironment;

    public UploadImgService(IWebHostEnvironment IWebHostEnvironment)
    {
        iWebHostEnvironment = IWebHostEnvironment;
    }
    public async Task<string> UploadImgUrlAsync(IFormFile img)
    {
        if (img == null || img.Length == 0)
            return "No file uploaded";

        var uploadsDirectory = Path.Combine("/var/www/","event-images/");
        if (!Directory.Exists(uploadsDirectory))
            Directory.CreateDirectory(uploadsDirectory);
        

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(img.FileName);
        var filePath = Path.Combine(uploadsDirectory, fileName);
        
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await img.CopyToAsync(stream);
        }
        
        return $"/event-images/{fileName}";
    }
    public async Task<string> UpdateImg(string FolderName, IFormFile Newimg, string OldPath)
    {
        var oldpath = iWebHostEnvironment.WebRootPath + OldPath;
        if(OldPath != null)
        {
            System.IO.File.Delete(oldpath);
        }
        return await UploadImgUrlAsync(Newimg);
    }
    public async void deleteImg(string OldPath)
    {
        var oldpath = iWebHostEnvironment.WebRootPath + OldPath;
        if(OldPath != null)
        {
            System.IO.File.Delete(oldpath);
        }
    }
}