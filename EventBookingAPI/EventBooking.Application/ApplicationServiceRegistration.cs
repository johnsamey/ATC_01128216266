using EventBooking.Application.Interfaces.Services;
using EventBooking.Application.Interfaces.Services.Auth;
using EventBooking.Application.Interfaces.Services.Bookings;
using EventBooking.Application.Interfaces.Services.Categories;
using EventBooking.Application.Interfaces.Services.Events;
using EventBooking.Application.Interfaces.Services.Statistics;
using EventBooking.Application.Interfaces.Services.UploadImg;
using EventBooking.Application.Interfaces.Services.User;
using EventBooking.Application.Services;
using EventBooking.Application.Services.Auth;
using EventBooking.Application.Services.Categories;
using EventBooking.Application.Services.Events;
using EventBooking.Application.Services.Statistics;
using EventBooking.Application.Services.UploadImg;
using Microsoft.Extensions.DependencyInjection;

namespace EventBooking.Application
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection service)
        {
            service.AddScoped<IAuthService, AuthService>();
            service.AddScoped<IEventService, EventService>();
            service.AddScoped<IUploadImgService, UploadImgService>();
            service.AddScoped<ICategoryService, CategoryService>();
            service.AddScoped<IBookingService, BookingService>();
            service.AddScoped<IUserService, UserService>();
            service.AddScoped<IStatisticsService, StatisticsService>();
            return service;
        }
    }
}
