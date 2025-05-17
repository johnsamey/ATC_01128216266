using EventBooking.Application.Interfaces.Repositories.Auth;
using EventBooking.Application.Interfaces.Repositories.Booking;
using EventBooking.Application.Interfaces.Repositories.Event;
using EventBooking.Infrastructure.Repository.Auth;
using EventBooking.Infrastructure.Repository.Booking;
using EventBooking.Infrastructure.Repository.Events;
using Microsoft.Extensions.DependencyInjection;
// using ServiceManagmentSystem.Application.Contract.Repository.Account;
// using ServiceManagmentSystem.Infrastructure.Repository.UserRole;

namespace EventBooking.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddApplicationRegistrationServices(this IServiceCollection service)
        {
            service.AddScoped<IAuthRepository, AuthRepository>();
            service.AddScoped<IEventRepository, EventRepository>();
            service.AddScoped<IBookingRepository, BookingRepository>();
            service.AddScoped<ICategoryRepository, CategoryRepository>();
            // service.AddScoped<IRegionRepository,RegionRepository>();
            return service;
        }
    }
}
