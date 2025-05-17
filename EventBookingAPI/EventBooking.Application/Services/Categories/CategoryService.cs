using AutoMapper;
using EventBooking.Application.Common;
using EventBooking.Application.DTOs.CategoryDTOs;
using EventBooking.Application.Interfaces.Repositories.Event;
using EventBooking.Application.Interfaces.Services.Categories;

namespace EventBooking.Application.Services.Categories;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoryService(ICategoryRepository categoryRepository,IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }
    public async Task<Response<List<CategoryDto>>> GetAllCategoriesAsync()
    {
        try
        {
            var categories = await _categoryRepository.GetAllAsync();
            categories = categories.OrderBy(c => c.Name);
            categories = categories.ToList();
            
            var categoryDtos = _mapper.Map<List<CategoryDto>>(categories);
            

            return Response<List<CategoryDto>>.Succeed(categoryDtos, "Categories retrieved successfully");
        }
        catch (Exception ex)
        {
            return Response<List<CategoryDto>>.Fail("Failed to retrieve categories", new List<string> { ex.Message });
        }
    }

    // public Task<Response<CategoryDto>> GetCategoryByIdAsync(int id)
    // {
    //     throw new NotImplementedException();
    // }
    //
    // public Task<Response<CategoryDto>> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
    // {
    //     throw new NotImplementedException();
    // }
    //
    // public Task<Response> DeleteCategoryAsync(int id)
    // {
    //     throw new NotImplementedException();
    // }
}