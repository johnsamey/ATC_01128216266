namespace EventBooking.Application.DTOs.BookingDTOs;

public class BookingQueryParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? Status { get; set; }
    public int? CategoryId { get; set; }
    public string? SortBy { get; set; }
}