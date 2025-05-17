using EventBooking.Application.DTOs.EventDTOs;
using EventBooking.Application.Helpers;
using EventBooking.Domain.Entities;

namespace EventBooking.Application.Interfaces.Repositories.Event;

public interface IEventRepository : IRepository<Domain.Entities.Event>
{
    Task<PagedResult<Domain.Entities.Event>> GetPagedAsync(EventQueryParams queryParams);
    Task<Domain.Entities.Event?> GetByTitleAsync(string title);
    Task<int> GetTotalEventsCountAsync();
}