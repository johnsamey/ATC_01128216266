using EventBooking.Application.DTOs.TagDTOs;

namespace EventBooking.Application.DTOs.EventDTOs;

public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Venue { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public List<TagDto> Tags { get; set; } = new List<TagDto>();
    public bool IsBooked { get; set; }
}