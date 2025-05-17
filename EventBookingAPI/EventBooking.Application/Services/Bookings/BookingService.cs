using AutoMapper;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.Helpers;
using EventBooking.Application.Interfaces.Repositories.Booking;
using EventBooking.Application.Interfaces.Repositories.Event;
using EventBooking.Application.Interfaces.Services;
using EventBooking.Application.Interfaces.Services.Bookings;
using EventBooking.Domain.Entities;

namespace EventBooking.Application.Services;
public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IEventRepository _eventRepository;
    private readonly IMapper _mapper;
    
    public BookingService(
        IBookingRepository bookingRepository, 
        IEventRepository eventRepository,
        IMapper mapper)
    {
        _bookingRepository = bookingRepository;
        _eventRepository = eventRepository;
        _mapper = mapper;
    }
    
    public async Task<Response<BookingDto>> GetBookingByIdAsync(int id)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return Response<BookingDto>.Fail($"Booking with ID {id} not found");
                
            var bookingDto = _mapper.Map<BookingDto>(booking);
            return Response<BookingDto>.Succeed(bookingDto, "Booking retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<BookingDto>.Fail("Failed to retrieve booking", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<PagedResult<BookingDto>>> GetAllBookingsAsync(string status,int page, int pageSize)
    {
        try
        {
            var pagedBookings = await _bookingRepository.GetPagedAsync(page, pageSize,status);
            
            var bookingDtos = _mapper.Map<List<BookingDto>>(pagedBookings.Items);
            
            var result = new PagedResult<BookingDto>
            {
                Items = bookingDtos,
                TotalCount = pagedBookings.TotalCount,
                Page = pagedBookings.Page,
                PageSize = pagedBookings.PageSize
            };
            
            return Response<PagedResult<BookingDto>>.Succeed(result, "Bookings retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<PagedResult<BookingDto>>.Fail("Failed to retrieve bookings", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<PagedResult<BookingDto>>> GetUserBookingsAsync(string userId,BookingQueryParams bookingQueryParams)
    {
        try
        {
            var pagedBookings = await _bookingRepository.GetUserBookingsPagedAsync(userId, bookingQueryParams);
            
            var bookingDtos = _mapper.Map<List<BookingDto>>(pagedBookings.Items);
            
            var result = new PagedResult<BookingDto>
            {
                Items = bookingDtos,
                TotalCount = pagedBookings.TotalCount,
                Page = pagedBookings.Page,
                PageSize = pagedBookings.PageSize
            };
            
            return Response<PagedResult<BookingDto>>.Succeed(result, "User bookings retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<PagedResult<BookingDto>>.Fail("Failed to retrieve user bookings", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<BookingDto>> CreateBookingAsync(string userId, CreateBookingDto bookingDto)
    {
        try
        {
            var eventEntity = await _eventRepository.GetByIdAsync(bookingDto.EventId);
            if (eventEntity == null)
                return Response<BookingDto>.Fail($"Event with ID {bookingDto.EventId} not found");
                
            var booking = _mapper.Map<Booking>(bookingDto);
            booking.UserId = userId;
            booking.BookingDate = DateTime.UtcNow;
            booking.TotalPrice = 0;
            booking.Status = "Pending";
            
            await _bookingRepository.AddAsync(booking);
            
            var createdBooking = await _bookingRepository.GetByIdAsync(booking.Id);
            var result = _mapper.Map<BookingDto>(createdBooking);
            
            return Response<BookingDto>.Succeed(result, "Booking created successfully");
        }
        catch (Exception ex)
        {
            return Response<BookingDto>.Fail("Failed to create booking", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<BookingDto>> UpdateBookingAsync(int id, UpdateBookingDto bookingDto)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return Response<BookingDto>.Fail($"Booking with ID {id} not found");
                
            _mapper.Map(bookingDto, booking);
            
            // // If number of tickets changed, recalculate total price
            // if (bookingDto.NumberOfTickets.HasValue)
            // {
            //     var eventEntity = await _eventRepository.GetByIdAsync(booking.EventId);
            //     booking.TotalPrice = eventEntity.Price * bookingDto.NumberOfTickets.Value;
            // }

            if (bookingDto.Status == "Confirmed")
            {
                var eventEntity = await _eventRepository.GetByIdAsync(booking.EventId);
                booking.TotalPrice = eventEntity.Price;
            }

            if (bookingDto.Status == "Cancelled")
            {
                var eventEntity = await _eventRepository.GetByIdAsync(booking.EventId);
                booking.TotalPrice = 0;
            }
            
            await _bookingRepository.UpdateAsync(booking);
            
            var updatedBooking = await _bookingRepository.GetByIdAsync(id);
            var result = _mapper.Map<BookingDto>(updatedBooking);
            
            return Response<BookingDto>.Succeed(result, "Booking updated successfully");
        }
        catch (Exception ex)
        {
            return Response<BookingDto>.Fail("Failed to update booking", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response> DeleteBookingAsync(int id)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return Response.Fail($"Booking with ID {id} not found");

            await _bookingRepository.DeleteAsync(id);
            return Response.Succeed("Booking deleted successfully");
        }
        catch (Exception ex)
        {
            return Response.Fail("Failed to delete booking", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<BookingDto>> CancelBookingAsync(int id)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return Response<BookingDto>.Fail($"Booking with ID {id} not found");
                
            booking.Status = "Cancelled";
            
            await _bookingRepository.UpdateAsync(booking);
            
            var updatedBooking = await _bookingRepository.GetByIdAsync(id);
            var result = _mapper.Map<BookingDto>(updatedBooking);
            
            return Response<BookingDto>.Succeed(result, "Booking cancelled successfully");
        }
        catch (Exception ex)
        {
            return Response<BookingDto>.Fail("Failed to cancel booking", new List<string> { ex.Message });
        }
    }
}