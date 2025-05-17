using EventBooking.Application.Common;
using EventBooking.Application.DTOs.CategoryDTOs;
using EventBooking.Application.Interfaces.Services.Categories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.API.Controller;

[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<Response<CategoryDto>>> GetAllCategories()
    {
        var response = await categoryService.GetAllCategoriesAsync();
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }
}