using EventBooking.Application.Common;
using EventBooking.Application.DTOs.EventDTOs;
using EventBooking.Application.Helpers;
using Microsoft.AspNetCore.Http;

namespace EventBooking.Application.Interfaces.Services.Events;

public interface IEventService
{
    Task<Response<PagedResult<EventDto>>> GetEventsAsync(EventQueryParams queryParams,string userId = null);
    Task<Response<EventDto>> GetEventByIdAsync(int id, string userId = null);
    Task<Response<EventDto>> CreateEventAsync(EventCreateDto eventDto);
    Task<Response<EventDto>> UpdateEventAsync(int id, EventUpdateDto eventDto);
    Task<Response> DeleteEventAsync(int id);
    Task<Response<string>> UploadImg(IFormFile img);
    Task<Response<int>> GetTotalEventsCountAsync();
}
