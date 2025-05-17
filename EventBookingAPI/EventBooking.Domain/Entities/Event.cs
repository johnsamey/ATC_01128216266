namespace EventBooking.Domain.Entities;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Venue { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    // public int Capacity { get; set; }
    
    public int CategoryId { get; set; }
    public Category Categories { get; set; }
    public ICollection<EventTag> EventTags { get; set; }
    public ICollection<Booking> Bookings { get; set; }
}