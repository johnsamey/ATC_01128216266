using AutoMapper;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.DTOs.EventDTOs;
using EventBooking.Application.DTOs.StatisticsDTOs;
using EventBooking.Application.Interfaces.Repositories.Booking;
using EventBooking.Application.Interfaces.Repositories.Event;
using EventBooking.Application.Interfaces.Services.Statistics;
using EventBooking.Application.Interfaces.Services;
using EventBooking.Application.Interfaces.Services.User;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.Application.Services.Statistics;

public class StatisticsService : IStatisticsService
{
    private readonly IEventRepository _eventRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    
    public StatisticsService(
        IEventRepository eventRepository,
        IBookingRepository bookingRepository,
        IUserService userService,
        IMapper mapper)
    {
        _eventRepository = eventRepository;
        _bookingRepository = bookingRepository;
        _userService = userService;
        _mapper = mapper;
    }
    
    public async Task<Response<StatisticsDto>> GetStatisticsAsync()
    {
        try
        {
            var statistics = new StatisticsDto();
            
            statistics.TotalEvents = await _eventRepository.GetTotalEventsCountAsync();
            
            var usersResponse = await _userService.GetTotalUsersCountAsync();
            if (!usersResponse.Success)
                return Response<StatisticsDto>.Fail("Failed to get total users count", usersResponse.Errors);
            statistics.TotalUsers = usersResponse.Data;
            
            var bookings = await _bookingRepository.GetAllAsync();
            statistics.TotalBookings = bookings.Count();
            statistics.TotalRevenue = bookings.Sum(b => b.TotalPrice);
            
            var recentBookings = bookings
                .OrderByDescending(b => b.BookingDate)
                .Take(10)
                .ToList();
            statistics.RecentBookings = _mapper.Map<List<BookingDto>>(recentBookings);
            var queryParams = new EventQueryParams
            {
                Page = 1,
                PageSize = 10,
            };
            var upcomingEvents = await _eventRepository.GetPagedAsync(queryParams);
            statistics.UpcomingEvents = _mapper.Map<List<EventDto>>(upcomingEvents.Items);
            
            return Response<StatisticsDto>.Succeed(statistics, "Statistics retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<StatisticsDto>.Fail("Failed to get statistics", new List<string> { ex.Message });
        }
    }
} 