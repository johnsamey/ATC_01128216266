using EventBooking.Application.DTOs.EventDTOs;
using EventBooking.Application.Helpers;
using EventBooking.Application.Interfaces.Repositories.Event;
using EventBooking.Domain.Entities;
using EventBooking.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.Infrastructure.Repository.Events;

public class EventRepository : IEventRepository
{
    private readonly ApplicationDbContext _context;
    
    public EventRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Event>> GetAllAsync()
    {
        return await _context.Events
            .Include(e => e.Categories)
            .Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
            .ToListAsync();
    }
    
    public async Task<Event?> GetByIdAsync(int id)
    {
        return await _context.Events
            .Include(e => e.Categories)
            .Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
            .FirstOrDefaultAsync(e => e.Id == id);
    }
    
    public async Task AddAsync(Event entity)
    {
        await _context.Events.AddAsync(entity);
        await _context.SaveChangesAsync();
    }
    
    public async Task UpdateAsync(Event entity)
    {
        _context.Events.Update(entity);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteAsync(int id)
    {
        var entity = await _context.Events.FindAsync(id);
        if (entity != null)
        {
            _context.Events.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
    
    public async Task<PagedResult<Event>> GetPagedAsync(EventQueryParams queryParams)
    {
        var query = _context.Events
            .Include(e => e.Categories)
            .Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
            .AsQueryable();
        query = query.Where(e => e.StartDate >= DateTime.UtcNow);
        if (!string.IsNullOrEmpty(queryParams.SearchTerm))
            query = query.Where(e => e.Title.Contains(queryParams.SearchTerm) || 
                                     e.Description.Contains(queryParams.SearchTerm));
            
        if (queryParams.CategoryId.HasValue)
            query = query.Where(e => e.CategoryId == queryParams.CategoryId.Value);
        
        if (queryParams.StartDate.HasValue)
        {
            query = query.Where(e => e.StartDate >= queryParams.StartDate.Value);
        }
        if (queryParams.EndDate.HasValue)
        {
            query = query.Where(e => e.StartDate <= queryParams.EndDate.Value);
        }

        if (queryParams.MinPrice.HasValue)
        {
            query = query.Where(e => e.Price >= queryParams.MinPrice.Value);
        }
        if (queryParams.MaxPrice.HasValue)
        {
            query = query.Where(e => e.Price <= queryParams.MaxPrice.Value);
        }

        if (!string.IsNullOrWhiteSpace(queryParams.Location))
        {
            query = query.Where(e => e.Venue.Contains(queryParams.Location));
        }

        
        var totalCount = await query.CountAsync();
        

        var items = await query
            .OrderBy(e => e.StartDate)
            .Skip((queryParams.Page - 1) * queryParams.PageSize)
            .Take(queryParams.PageSize)
            .ToListAsync();
            
        return new PagedResult<Event>
        {
            Items = items,
            TotalCount = totalCount,
            Page = queryParams.Page,
            PageSize = queryParams.PageSize
        };
    }

    public async Task<Event?> GetByTitleAsync(string title)
    {
        return await _context.Events
            .Include(e => e.Categories)
            .Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
            .FirstOrDefaultAsync(e => e.Title.ToLower() == title.ToLower());
    }

    public async Task<int> GetTotalEventsCountAsync()
    {
        return await _context.Events.CountAsync();
    }
}