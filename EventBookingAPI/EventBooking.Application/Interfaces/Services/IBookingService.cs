using EventBooking.Application.Common;
using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.Helpers;

namespace EventBooking.Application.Interfaces.Services;

public interface IBookingService
{
    Task<Response<BookingDto>> GetBookingByIdAsync(int id);
    // Task<Response<IEnumerable<BookingDto>>> GetAllBookingsAsync();
    Task<Response<PagedResult<BookingDto>>> GetAllBookingsAsync(string status,int page, int pageSize);
    // Task<Response<IEnumerable<BookingDto>>> GetUserBookingsAsync(string userId);
    Task<Response<PagedResult<BookingDto>>> GetUserBookingsAsync(string userId,BookingQueryParams queryParams);
    Task<Response<BookingDto>> CreateBookingAsync(string userId, CreateBookingDto createBookingDto);
    Task<Response<BookingDto>> UpdateBookingAsync(int id, UpdateBookingDto updateBookingDto);
    Task<Response> DeleteBookingAsync(int id);
    Task<Response<BookingDto>> CancelBookingAsync(int id);
} 