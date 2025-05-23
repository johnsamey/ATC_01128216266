using System.ComponentModel.DataAnnotations;

namespace EventBooking.Application.DTOs.AuthDTOs;

public class LoginDto
{
    [Required]
    public string UserName { get; set; }
    
    [Required]
    public string Password { get; set; }
}
