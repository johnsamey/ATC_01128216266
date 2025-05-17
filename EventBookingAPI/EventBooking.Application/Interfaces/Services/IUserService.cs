using System.Security.Claims;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.UserDTOs;

namespace EventBooking.Application.Interfaces.Services;

public interface IUserService
{
    Task<Response<UserProfileDto>> GetUserByIdAsync(string userId);
    Task<Response<UserProfileDto>> GetCurrentUserAsync(ClaimsPrincipal userClaim);
    Task<Response<UserProfileDto>> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
    Task<Response> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto);
    Task<Response> DeleteAccountAsync(string userId);
    Task<Response<int>> GetTotalUsersCountAsync();
} 