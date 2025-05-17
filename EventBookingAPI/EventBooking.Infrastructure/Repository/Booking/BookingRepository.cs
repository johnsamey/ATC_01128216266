using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.Helpers;
using EventBooking.Application.Interfaces.Repositories.Booking;
using EventBooking.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.Infrastructure.Repository.Booking;

public class BookingRepository : IBookingRepository
{
    private readonly ApplicationDbContext _context;
    
    public BookingRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<int>> GetUserBooking(string userId)
    {
        return await _context.Bookings
            .Where(b => b.UserId == userId)
            .Select(b => b.EventId)
            .ToListAsync();
    }

    public async Task<bool> IsEventBooked(int id, string userId)
    {
        return await _context.Bookings.AnyAsync(b => b.EventId == id && b.UserId == userId);
    }
    
    public async Task<Domain.Entities.Booking?> GetByIdAsync(int id)
    {
        return await _context.Bookings
            .Include(b => b.Event)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Domain.Entities.Booking>> GetAllAsync()
    {
        return await _context.Bookings
            .Include(b => b.Event)
            .Include(b => b.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Domain.Entities.Booking>> GetUserBookingsAsync(string userId)
    {
        return await _context.Bookings
            .Include(b => b.Event)
            .Where(b => b.UserId == userId)
            .ToListAsync();
    }

    public async Task AddAsync(Domain.Entities.Booking booking)
    {
        await _context.Bookings.AddAsync(booking);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Domain.Entities.Booking booking)
    {
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking != null)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();   
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Bookings.AnyAsync(b => b.Id == id);
    }
    
    public async Task<PagedResult<Domain.Entities.Booking>> GetPagedAsync(int page, int pageSize, string status = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _context.Bookings
            .Include(b => b.Event)
            .Include(b => b.User)
            .AsQueryable();
    
        // Apply filters
        if (!string.IsNullOrEmpty(status))
            query = query.Where(b => b.Status == status);
        
        if (fromDate.HasValue)
            query = query.Where(b => b.BookingDate >= fromDate.Value);
        
        if (toDate.HasValue)
            query = query.Where(b => b.BookingDate <= toDate.Value);
    
        var totalCount = await query.CountAsync();
    
        var items = await query
            .OrderByDescending(b => b.BookingDate)  // Most recent bookings first
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        
        return new PagedResult<Domain.Entities.Booking>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<Domain.Entities.Booking>> GetUserBookingsPagedAsync(string userId, BookingQueryParams bookingQueryParams)
    {
        var query = _context.Bookings
            .Include(b => b.Event)
            .ThenInclude(e=> e.Categories)
            .Where(b => b.UserId == userId)
            .AsQueryable();
    
        
        if (!string.IsNullOrEmpty(bookingQueryParams.Status))
            query = query.Where(b => b.Status == bookingQueryParams.Status);
    
        if (!string.IsNullOrEmpty(bookingQueryParams.SearchTerm))
        {
            query = query.Where(b => 
                b.Event.Title.Contains(bookingQueryParams.SearchTerm) ||
                b.Event.Description.Contains(bookingQueryParams.SearchTerm));
        }
        
        if (bookingQueryParams.CategoryId.HasValue)
        {
            query = query.Where(b => b.Event.CategoryId == bookingQueryParams.CategoryId.Value);
        }

        query = bookingQueryParams.SortBy?.ToLower() switch
        {
            "oldest" => query.OrderBy(b => b.BookingDate),
            "price_asc" => query.OrderBy(b => b.TotalPrice),
            "price_desc" => query.OrderByDescending(b => b.TotalPrice),
            "date_asc" => query.OrderBy(b => b.Event.StartDate),
            "date_desc" => query.OrderByDescending(b => b.Event.StartDate),
            _ => query.OrderByDescending(b => b.BookingDate)
        };
        var totalCount = await query.CountAsync();
    
        var items = await query 
            .Skip((bookingQueryParams.Page - 1) * bookingQueryParams.PageSize)
            .Take(bookingQueryParams.PageSize)
            .ToListAsync();
        
        return new PagedResult<Domain.Entities.Booking>
        {
            Items = items,
            TotalCount = totalCount,
            Page = bookingQueryParams.Page,
            PageSize = bookingQueryParams.PageSize
        };
    }
}