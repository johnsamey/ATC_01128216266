using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace EventBooking.Application.DTOs.EventDTOs;

public class EventUpdateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? CategoryId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Venue { get; set; }
    
    [Range(0, 10000)]
    public decimal? Price { get; set; }
    
    public string? ImageUrl { get; set; }
    public IFormFile? Img { get; set; }
    
    public List<int>? TagIds { get; set; }
} 