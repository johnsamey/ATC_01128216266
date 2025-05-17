using EventBooking.Application.Common;
using EventBooking.Application.DTOs.StatisticsDTOs;
using EventBooking.Application.Interfaces.Services.Statistics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.API.Controller;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsService _statisticsService;
    
    public StatisticsController(IStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }
    
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Response<StatisticsDto>>> GetStatistics()
    {
        var response = await _statisticsService.GetStatisticsAsync();
        Console.WriteLine(response);
        if (!response.Success)
            return BadRequest(response);
            
        return Ok(response);
    }
} 