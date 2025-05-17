using System;

namespace EventBooking.Application.DTOs.BookingDTOs;

public class BookingDto
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public int EventId { get; set; }
    public DateTime BookingDate { get; set; }
    public int NumberOfTickets { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; }
}

public class CreateBookingDto
{
    public int EventId { get; set; }
    public int NumberOfTickets { get; set; }
}

public class UpdateBookingDto
{
    public int? NumberOfTickets { get; set; }
    public string Status { get; set; }
} 