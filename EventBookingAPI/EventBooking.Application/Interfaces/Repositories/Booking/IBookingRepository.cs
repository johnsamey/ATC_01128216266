using System.Collections.Generic;
using System.Threading.Tasks;
using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.Helpers;
using EventBooking.Domain.Entities;

namespace EventBooking.Application.Interfaces.Repositories.Booking;

public interface IBookingRepository : IRepository<Domain.Entities.Booking>
{
    Task<IEnumerable<Domain.Entities.Booking>> GetUserBookingsAsync(string userId);
    Task<bool> ExistsAsync(int id);
    Task<bool> IsEventBooked(int id, string userId);

    Task<PagedResult<Domain.Entities.Booking>> GetPagedAsync(int page, int pageSize, string status = null,
        DateTime? fromDate = null, DateTime? toDate = null);

    Task<PagedResult<Domain.Entities.Booking>> GetUserBookingsPagedAsync(string userId, BookingQueryParams bookingQueryParams);
} 