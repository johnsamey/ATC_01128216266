using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;

namespace EventBooking.Application.DTOs.EventDTOs;

public class EventCreateDto
{
    [Required]
    public string Title { get; set; }
    
    [Required]
    public string Description { get; set; }
    
    [Required]
    public int CategoryId { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime EndDate { get; set; }
    
    [Required]
    public string Venue { get; set; }
    
    [Required]
    [Range(0, 10000)]
    public decimal Price { get; set; }
    [SwaggerIgnore]
    public string? ImageUrl { get; set; }
    public IFormFile? Img { get; set; }
    
    public List<int> TagIds { get; set; } = new List<int>();
}


