using EventBooking.Application.Common;
using EventBooking.Application.DTOs.AuthDTOs;
using EventBooking.Application.DTOs.UserDTOs;

namespace EventBooking.Application.Interfaces.Services.Auth;

public interface IAuthService
{
    Task<Response> RegisterAsync(RegisterDto registerDto);
    Task<Response<AuthResponseDto>> LoginAsync(LoginDto loginDto);
    Task<Response> SeedAdminAsync();
} 