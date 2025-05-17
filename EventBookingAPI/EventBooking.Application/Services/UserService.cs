using System.Security.Claims;
using AutoMapper;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.UserDTOs;
using EventBooking.Application.Interfaces.Services;
using EventBooking.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;

    public UserService(UserManager<ApplicationUser> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<Response<UserProfileDto>> GetUserByIdAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Response<UserProfileDto>.Fail("User not found");

            var userDto = _mapper.Map<UserProfileDto>(user);
            return Response<UserProfileDto>.Succeed(userDto);
        }
        catch (Exception ex)
        {
            return Response<UserProfileDto>.Fail("Failed to retrieve user", new List<string> { ex.Message });
        }
    }

    public async Task<Response<UserProfileDto>> GetCurrentUserAsync(ClaimsPrincipal User)
    {
        try
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Response<UserProfileDto>.Fail("User not found");

            var userDto = _mapper.Map<UserProfileDto>(user);
            return Response<UserProfileDto>.Succeed(userDto);
        }
        catch (Exception ex)
        {
            return Response<UserProfileDto>.Fail("Failed to retrieve current user", new List<string> { ex.Message });
        }
    }

    public async Task<Response<UserProfileDto>> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Response<UserProfileDto>.Fail("User not found");

            // Check if email is being changed and is already taken
            if (!string.IsNullOrEmpty(updateUserDto.Email) && user.Email != updateUserDto.Email)
            {
                var existingUser = await _userManager.FindByEmailAsync(updateUserDto.Email);
                if (existingUser != null && existingUser.Id != userId)
                    return Response<UserProfileDto>.Fail("Email is already taken");
            }

            // Check if username is being changed and is already taken
            if (!string.IsNullOrEmpty(updateUserDto.UserName) && user.UserName != updateUserDto.UserName)
            {
                var existingUser = await _userManager.FindByNameAsync(updateUserDto.UserName);
                if (existingUser != null && existingUser.Id != userId)
                    return Response<UserProfileDto>.Fail("Username is already taken");
            }

            // Update only the fields that are provided
            if (!string.IsNullOrEmpty(updateUserDto.FirstName))
                user.FirstName = updateUserDto.FirstName;

            if (!string.IsNullOrEmpty(updateUserDto.LastName))
                user.LastName = updateUserDto.LastName;

            if (!string.IsNullOrEmpty(updateUserDto.Email))
                user.Email = updateUserDto.Email;

            if (!string.IsNullOrEmpty(updateUserDto.UserName))
                user.UserName = updateUserDto.UserName;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return Response<UserProfileDto>.Fail("Failed to update user", result.Errors.Select(e => e.Description).ToList());

            var userDto = _mapper.Map<UserProfileDto>(user);
            return Response<UserProfileDto>.Succeed(userDto, "User updated successfully");
        }
        catch (Exception ex)
        {
            return Response<UserProfileDto>.Fail("Failed to update user", new List<string> { ex.Message });
        }
    }

    public async Task<Response> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Response.Fail("User not found");

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            if (!result.Succeeded)
                return Response.Fail("Failed to change password", result.Errors.Select(e => e.Description).ToList());

            return Response.Succeed("Password changed successfully");
        }
        catch (Exception ex)
        {
            return Response.Fail("Failed to change password", new List<string> { ex.Message });
        }
    }

    public async Task<Response> DeleteAccountAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Response.Fail("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return Response.Fail("Failed to delete account", result.Errors.Select(e => e.Description).ToList());

            return Response.Succeed("Account deleted successfully");
        }
        catch (Exception ex)
        {
            return Response.Fail("Failed to delete account", new List<string> { ex.Message });
        }
    }

    public async Task<Response<int>> GetTotalUsersCountAsync()
    {
        try
        {
            var totalUsers = await _userManager.Users.CountAsync();
            return Response<int>.Succeed(totalUsers, "Total users count retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<int>.Fail("Failed to get total users count", new List<string> { ex.Message });
        }
    }
} 