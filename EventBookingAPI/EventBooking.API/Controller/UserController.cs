using System.Security.Claims;
using EventBooking.Application.DTOs.UserDTOs;
using EventBooking.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.API.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Unauthorized();
        }
        var response = await _userService.GetCurrentUserAsync(User);
        if (!response.Success)
            return NotFound(response);

        return Ok(response);
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<IActionResult> GetUser(string id)
    {
        var response = await _userService.GetUserByIdAsync(id);
        if (!response.Success)
            return NotFound(response);

        return Ok(response);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateUser(UpdateUserDto updateUserDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var response = await _userService.UpdateUserAsync(userId, updateUserDto);
        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var response = await _userService.ChangePasswordAsync(userId, changePasswordDto);
        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var response = await _userService.DeleteAccountAsync(userId);
        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpGet("count")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<IActionResult> GetTotalUsers()
    {
        var response = await _userService.GetTotalUsersCountAsync();
        if (!response.Success)
            return BadRequest(response);
        return Ok(response);
    }
}