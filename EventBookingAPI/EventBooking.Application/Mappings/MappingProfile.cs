using AutoMapper;
using EventBooking.Application.DTOs.BookingDTOs;
using EventBooking.Application.DTOs.CategoryDTOs;
using EventBooking.Application.DTOs.EventDTOs;
using EventBooking.Application.DTOs.TagDTOs;
using EventBooking.Application.DTOs.UserDTOs;
using EventBooking.Domain.Entities;

namespace EventBooking.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Event, EventDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Categories.Name))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.EventTags.Select(et => et.Tag)));
        CreateMap<EventCreateDto, Event>()
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateTime.SpecifyKind(src.StartDate, DateTimeKind.Utc)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => DateTime.SpecifyKind(src.EndDate, DateTimeKind.Utc)));
        CreateMap<EventUpdateDto, Event>().ReverseMap();
        
        CreateMap<Category, CategoryDto>();
        
        CreateMap<Tag, TagDto>();

        CreateMap<Booking, BookingDto>().ReverseMap();
        CreateMap<CreateBookingDto, Booking>().ReverseMap();
        CreateMap<UpdateBookingDto, Booking>().ReverseMap();
        CreateMap<ApplicationUser, UserDto>();
        CreateMap<ApplicationUser, UpdateUserDto>().ReverseMap();
        CreateMap<ApplicationUser, UserProfileDto>().ReverseMap();
    }
}