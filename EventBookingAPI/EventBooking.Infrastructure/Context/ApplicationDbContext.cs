using EventBooking.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.Infrastructure.Context;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Event> Events { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    
    public DbSet<ApplicationUser> Users { get; set; }
    
    public DbSet<Category> Categories { get; set; }
    
    public DbSet<EventTag> EventTags { get; set; }
    
    public DbSet<Tag> Tags { get; set; }
}