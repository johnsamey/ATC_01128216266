using System.Security.Claims;
using AutoMapper;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.AuthDTOs;
using EventBooking.Application.DTOs.UserDTOs;
using EventBooking.Application.Interfaces.Services;
using EventBooking.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using EventBooking.Application.Interfaces.Services.Auth;
using Microsoft.AspNetCore.Authorization;


namespace EventBooking.API.Controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService,UserManager<ApplicationUser> userManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var response = await authService.RegisterAsync(registerDto);
        
        if (!response.Success)
            return BadRequest(response);
            
        return Ok(response);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var response = await authService.LoginAsync(loginDto);
        
        if (!response.Success)
            return BadRequest(response);
        
        return Ok(response);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new Response { Message = "Logged out successfully" });
    }
    
    
    [HttpGet("current-user")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();

        var roles = await userManager.GetRolesAsync(user);
    
        return Ok(new Response<UserDto>
        {
            Success = true,
            Message = "User retrieved successfully",
            Data = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles.ToList()
            }
        });
    }
}