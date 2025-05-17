using System.Security.Claims;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.EventDTOs;
using EventBooking.Application.Helpers;
using EventBooking.Application.Interfaces.Services.Events;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.API.Controller;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;
    
    public EventsController(IEventService eventService, IWebHostEnvironment environment)
    {
        _eventService = eventService;
    }
    
    [HttpGet]
    public async Task<ActionResult<Response<PagedResult<EventDto>>>> GetEvents(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string searchTerm = "",
        [FromQuery] int? categoryId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] string? location = null)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var queryParams = new EventQueryParams
        {
            Page = page,
            PageSize = pageSize,
            SearchTerm = searchTerm,
            CategoryId = categoryId,
            StartDate = startDate,
            EndDate = endDate,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            Location = location
        };
        var response = await _eventService.GetEventsAsync(queryParams, userId);
        
        if (!response.Success)
            return BadRequest(response);
            
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Response<EventDto>>> GetEvent(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _eventService.GetEventByIdAsync(id, userId);
        
        if (!response.Success)
            return NotFound(response);
            
        return Ok(response);
    }
    
    [HttpPost]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<Response<EventDto>>> CreateEvent([FromForm] EventCreateDto eventDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(Response<EventDto>.Fail("Invalid data", 
                ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList()));
        }

        if (eventDto.Img != null)
        {
            var imageResponse = await _eventService.UploadImg(eventDto.Img);
            if (!imageResponse.Success)
            {
                return BadRequest(imageResponse);
            }

            eventDto.ImageUrl = imageResponse.Data;
        }

        var response = await _eventService.CreateEventAsync(eventDto);
        
        if (!response.Success)
            return BadRequest(response);
            
        return CreatedAtAction(nameof(GetEvent), new { id = response.Data.Id }, response);
    }
    
    [HttpPut("{id}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<Response<EventDto>>> UpdateEvent(int id, [FromForm] EventUpdateDto eventDto)
    {
        var response = await _eventService.UpdateEventAsync(id, eventDto);
        
        if (!response.Success)
            return BadRequest(response);
            
        return Ok(response);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<Response>> DeleteEvent(int id)
    {
        var response = await _eventService.DeleteEventAsync(id);
        
        if (!response.Success)
            return BadRequest(response);
            
        return Ok(response);
    }

    [HttpGet("total")]
    public async Task<ActionResult<Response<int>>> GetTotalEvents()
    {
        var response = await _eventService.GetTotalEventsCountAsync();
        
        if (!response.Success)
            return BadRequest(response);
            
        return Ok(response);
    }
}