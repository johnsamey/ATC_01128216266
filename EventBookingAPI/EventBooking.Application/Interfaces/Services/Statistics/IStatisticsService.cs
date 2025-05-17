using EventBooking.Application.Common;
using EventBooking.Application.DTOs.StatisticsDTOs;

namespace EventBooking.Application.Interfaces.Services.Statistics;
 
public interface IStatisticsService
{
    Task<Response<StatisticsDto>> GetStatisticsAsync();
} 