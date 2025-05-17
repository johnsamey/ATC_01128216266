namespace EventBooking.Application.DTOs.AuthDTOs;

public class AuthStatusDto
{
    public bool IsAuthenticated { get; set; }
    public string UserName { get; set; }
    public string UserId { get; set; }
    
    public List<string> Roles { get; set; }
}