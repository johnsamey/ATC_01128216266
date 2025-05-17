using AutoMapper;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.EventDTOs;
using EventBooking.Application.Helpers;
using EventBooking.Application.Interfaces.Repositories;
using EventBooking.Application.Interfaces.Repositories.Booking;
using EventBooking.Application.Interfaces.Repositories.Event;
using EventBooking.Application.Interfaces.Services.Events;
using EventBooking.Application.Interfaces.Services.UploadImg;
using EventBooking.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.Application.Services.Events;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IUploadImgService _uploadImgService;
    private readonly IMapper _mapper;
    
    public EventService(
        IEventRepository eventRepository, 
        IBookingRepository bookingRepository,
        IUploadImgService uploadImgService,
        IMapper mapper)
    {
        _eventRepository = eventRepository;
        _bookingRepository = bookingRepository;
        _uploadImgService = uploadImgService;
        _mapper = mapper;
    }
    
    public async Task<Response<PagedResult<EventDto>>> GetEventsAsync(EventQueryParams queryParams,string userId)
    {
        try
        {
            var pagedEvents = await _eventRepository.GetPagedAsync(queryParams);
            
            var eventDtos = _mapper.Map<List<EventDto>>(pagedEvents.Items);
            
            if (!string.IsNullOrEmpty(userId))
            {
                var userBookings = await _bookingRepository.GetUserBookingsAsync(userId);
            
                if (userBookings != null && userBookings.Any())
                {
                    var bookedEventIds = userBookings.Select(b => b.EventId).ToHashSet();
                    
                    foreach (var eventDto in eventDtos)
                    {
                        eventDto.IsBooked = bookedEventIds.Contains(eventDto.Id);
                    }
                }
                else
                {
                    foreach (var eventDto in eventDtos)
                    {
                        eventDto.IsBooked = false;
                    }
                }
            }
            
            var result = new PagedResult<EventDto>
            {
                Items = eventDtos,
                TotalCount = pagedEvents.TotalCount,
                Page = pagedEvents.Page,
                PageSize = pagedEvents.PageSize
            };

            return Response<PagedResult<EventDto>>.Succeed(result, "Events retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<PagedResult<EventDto>>.Fail("Failed to retrieve events", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<EventDto>> GetEventByIdAsync(int id, string userId = null)
    {
        try
        {
            var eventEntity = await _eventRepository.GetByIdAsync(id);
            if (eventEntity == null)
                return Response<EventDto>.Fail($"Event with ID {id} not found");
                
            var eventDto = _mapper.Map<EventDto>(eventEntity);
            
            if (!string.IsNullOrEmpty(userId))
            {
                eventDto.IsBooked = await _bookingRepository.IsEventBooked(id, userId);
            }
            
            return Response<EventDto>.Succeed(eventDto, "Event retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<EventDto>.Fail("Failed to retrieve event", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<EventDto>> CreateEventAsync(EventCreateDto eventDto)
    {
        try
        {
            var eventEntity = _mapper.Map<Event>(eventDto);
            
            if (eventDto.TagIds != null && eventDto.TagIds.Any())
            {
                eventEntity.EventTags = eventDto.TagIds
                    .Select(tagId => new EventTag { TagId = tagId })
                    .ToList();
            }
            
            await _eventRepository.AddAsync(eventEntity);
            
            var createdEvent = await _eventRepository.GetByIdAsync(eventEntity.Id);
            var result = _mapper.Map<EventDto>(createdEvent);
            
            return Response<EventDto>.Succeed(result, "Event created successfully");
        }
        catch (Exception ex)
        {
            return Response<EventDto>.Fail("Failed to create event", new List<string> { ex.Message });
        }
    }

    public async Task<Response> DeleteEventAsync(int id)
    {
        try
        {
            var eventEntity = await _eventRepository.GetByIdAsync(id);
            if (eventEntity == null)
                return Response.Fail($"Event with ID {id} not found");

            await _eventRepository.DeleteAsync(id);
            return Response.Succeed("Event deleted successfully");
        }
        catch (Exception ex)
        {
            return Response.Fail("Failed to delete event", new List<string> { ex.Message });
        }
    }
    
    public async Task<Response<string>> UploadImg(IFormFile img)
    {
        try
        {
            if (img == null || img.Length == 0)
                return Response<string>.Fail("No file uploaded");

            var result = await _uploadImgService.UploadImgUrlAsync(img);
            return Response<string>.Succeed(result, "Image uploaded successfully");
        }
        catch (Exception ex)
        {
            return Response<string>.Fail("Failed to upload image", new List<string> { ex.Message });
        }
    }

    public async Task<Response<int>> GetTotalEventsCountAsync()
    {
        try
        {
            var totalCount = await _eventRepository.GetTotalEventsCountAsync();
            return Response<int>.Succeed(totalCount, "Total events count retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<int>.Fail("Failed to get total events count", new List<string> { ex.Message });
        }
    }

    public async Task<Response<EventDto>> UpdateEventAsync(int id, EventUpdateDto eventDto)
    {
        try
        {
            var eventEntity = await _eventRepository.GetByIdAsync(id);
            if (eventEntity == null)
                return Response<EventDto>.Fail($"Event with ID {id} not found");

            // Update only the fields that are provided
            if (eventDto.Title != null)
                eventEntity.Title = eventDto.Title;

            if (eventDto.Description != null)
                eventEntity.Description = eventDto.Description;

            if (eventDto.CategoryId.HasValue)
                eventEntity.CategoryId = eventDto.CategoryId.Value;

            if (eventDto.StartDate.HasValue)
                eventEntity.StartDate = eventDto.StartDate.Value;

            if (eventDto.EndDate.HasValue)
                eventEntity.EndDate = eventDto.EndDate.Value;

            if (eventDto.Venue != null)
                eventEntity.Venue = eventDto.Venue;

            if (eventDto.Price.HasValue)
                eventEntity.Price = eventDto.Price.Value;

            // Handle image update if provided
            if (eventDto.Img != null)
            {
                var imageResponse = await UploadImg(eventDto.Img);
                if (!imageResponse.Success)
                    return Response<EventDto>.Fail("Failed to upload new image", new List<string> { imageResponse.Message });

                eventEntity.ImageUrl = imageResponse.Data;
            }

            // Handle tags update if provided
            if (eventDto.TagIds != null)
            {
                // Remove existing tags
                eventEntity.EventTags?.Clear();
                
                // Add new tags
                if (eventDto.TagIds.Any())
                {
                    eventEntity.EventTags = eventDto.TagIds
                        .Select(tagId => new EventTag { TagId = tagId })
                        .ToList();
                }
            }

            await _eventRepository.UpdateAsync(eventEntity);
            
            var updatedEvent = await _eventRepository.GetByIdAsync(id);
            var result = _mapper.Map<EventDto>(updatedEvent);
            
            return Response<EventDto>.Succeed(result, "Event updated successfully");
        }
        catch (Exception ex)
        {
            return Response<EventDto>.Fail("Failed to update event", new List<string> { ex.Message });
        }
    }
}