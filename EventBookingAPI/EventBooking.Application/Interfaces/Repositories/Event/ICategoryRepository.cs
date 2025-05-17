using EventBooking.Domain.Entities;

namespace EventBooking.Application.Interfaces.Repositories.Event;

public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetByNameAsync(string name);
} 