using EventBooking.Domain.Entities;

namespace EventBooking.Application.Interfaces.Repositories.Auth;

public interface IAuthRepository
{
    Task<ApplicationUser?> GetUserByUsernameAsync(string username);
    Task<bool> CreateUserAsync(ApplicationUser user, string password);
    Task<bool> AddUserToRoleAsync(ApplicationUser user, string role);
    Task<IList<string>> GetUserRolesAsync(ApplicationUser user);
    Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
    Task<bool> RoleExistsAsync(string role);
    Task<bool> CreateRoleAsync(string role);
} 