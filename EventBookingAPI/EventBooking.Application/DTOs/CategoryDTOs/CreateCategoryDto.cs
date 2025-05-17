using System.ComponentModel.DataAnnotations;

namespace EventBooking.Application.DTOs.CategoryDTOs;

public class CreateCategoryDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }

}