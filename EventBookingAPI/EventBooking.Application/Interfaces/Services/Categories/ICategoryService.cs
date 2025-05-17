using EventBooking.Application.Common;
using EventBooking.Application.DTOs.CategoryDTOs;

namespace EventBooking.Application.Interfaces.Services.Categories;

public interface ICategoryService
{
    Task<Response<List<CategoryDto>>> GetAllCategoriesAsync();
    // Task<Response<CategoryDto>> GetCategoryByIdAsync(int id);
    // Task<Response<CategoryDto>> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
    // Task<CategoryDto> UpdateCategoryAsync(UpdateCategoryDto updateCategoryDto);
    // Task<Response> DeleteCategoryAsync(int id);
}