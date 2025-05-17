using System.Security.Claims;
using System.Threading.Tasks;
using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.API.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBooking(int id)
    {
        var response = await _bookingService.GetBookingByIdAsync(id);
        if (!response.Success)
            return NotFound(response);

        return Ok(response);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllBookings([FromQuery] string? status,[FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var response = await _bookingService.GetAllBookingsAsync(status,page,pageSize);
        if (!response.Success)
            return BadRequest(response);
        return Ok(response);
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetUserBookings([FromQuery] BookingQueryParams bookingQueryParams)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine(userId);
        if (userId == null) return Unauthorized();
        var response = await _bookingService.GetUserBookingsAsync(userId,bookingQueryParams);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking(CreateBookingDto createBookingDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();
        var response = await _bookingService.CreateBookingAsync(userId, createBookingDto);
        
        if (!response.Success)
            return BadRequest(response);

        return CreatedAtAction(nameof(GetBooking), new { id = response.Data.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(int id, UpdateBookingDto updateBookingDto)
    {
        var response = await _bookingService.UpdateBookingAsync(id, updateBookingDto);
        
        if (!response.Success)
            return NotFound(response);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var response = await _bookingService.DeleteBookingAsync(id);
        
        if (!response.Success)
            return NotFound(response);

        return Ok(response);
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        var response = await _bookingService.CancelBookingAsync(id);
        
        if (!response.Success)
            return NotFound(response);

        return Ok(response);
    }
} 