using System;

namespace EventBooking.Domain.Entities;

public class Booking
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; }
    public DateTime BookingDate { get; set; }
    public int NumberOfTickets { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } // Pending, Confirmed, Cancelled
}