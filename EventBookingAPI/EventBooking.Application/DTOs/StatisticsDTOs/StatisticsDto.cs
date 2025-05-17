using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.DTOs.EventDTOs;

namespace EventBooking.Application.DTOs.StatisticsDTOs;

public class StatisticsDto
{
    public int TotalEvents { get; set; }
    public int TotalBookings { get; set; }
    public int TotalUsers { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<BookingDto> RecentBookings { get; set; } = new();
    public List<EventDto> UpcomingEvents { get; set; } = new();
} 