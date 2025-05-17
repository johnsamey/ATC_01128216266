using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.Domain.Entities;

[PrimaryKey("EventId","TagId")]
public class EventTag
{
    [Key]
    public int EventId { get; set; }
    [Key]
    public int TagId { get; set; }
    
    public Event Event { get; set; }
    public Tag Tag { get; set; }
}