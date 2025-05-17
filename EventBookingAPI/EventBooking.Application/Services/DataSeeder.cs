using EventBooking.Application.Interfaces.Repositories;
using EventBooking.Application.Interfaces.Repositories.Event;
using EventBooking.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace EventBooking.Application.Services;

public class DataSeeder
{
    private readonly IEventRepository _eventRepository;
    private readonly ICategoryRepository _categoryRepository;
    // private readonly ITagRepository _tagRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public DataSeeder(
        IEventRepository eventRepository,
        ICategoryRepository categoryRepository,
        // ITagRepository tagRepository,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _eventRepository = eventRepository;
        _categoryRepository = categoryRepository;
        // _tagRepository = tagRepository;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedDataAsync()
    {
        // Seed roles if they don't exist
        if (!await _roleManager.RoleExistsAsync("Admin"))
            await _roleManager.CreateAsync(new IdentityRole("Admin"));
        if (!await _roleManager.RoleExistsAsync("User"))
            await _roleManager.CreateAsync(new IdentityRole("User"));

        // Seed admin user if it doesn't exist
        var adminUser = await _userManager.FindByEmailAsync("admin@example.com");
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@example.com",
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
                await _userManager.AddToRoleAsync(adminUser, "Admin");
        }

        // Seed demo user if it doesn't exist
        var demoUser = await _userManager.FindByEmailAsync("user@example.com");
        if (demoUser == null)
        {
            demoUser = new ApplicationUser
            {
                UserName = "user",
                Email = "user@example.com",
                FirstName = "Demo",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(demoUser, "User123!");
            if (result.Succeeded)
                await _userManager.AddToRoleAsync(demoUser, "User");
        }

        // Seed categories if they don't exist
        var categories = new List<Category>
        {
            new() { Name = "Technology"},
            new() { Name = "Business"},
            new() { Name = "Arts"},
            new() { Name = "Sports"},
            new() { Name = "Music"}
        };

        foreach (var category in categories)
        {
            var existingCategory = await _categoryRepository.GetByNameAsync(category.Name);
            if (existingCategory == null)
                await _categoryRepository.AddAsync(category);
        }

        // Seed tags if they don't exist
        var tags = new List<Tag>
        {
            new() { Name = "Conference" },
            new() { Name = "Workshop" },
            new() { Name = "Seminar" },
            new() { Name = "Networking" },
            new() { Name = "Exhibition" }
        };

        // foreach (var tag in tags)
        // {
        //     var existingTag = await _tagRepository.GetByNameAsync(tag.Name);
        //     if (existingTag == null)
        //         await _tagRepository.AddAsync(tag);
        // }

        // Seed events if they don't exist
        var events = new List<Event>
        {
            new()
            {
                Title = "Tech Conference 2024",
                Description = "Annual technology conference featuring the latest innovations",
                StartDate = DateTime.UtcNow.AddDays(30),
                EndDate = DateTime.UtcNow.AddDays(32),
                Venue = "Convention Center, New York",
                Price = 299.99m,
                CategoryId = 1,
                // EventTags = new List<EventTag> { new() { TagId = tags[0].Id } },
                ImageUrl = "/uploads/tech-conference.jpg"
            },
            new()
            {
                Title = "Business Networking Event",
                Description = "Connect with industry leaders and entrepreneurs",
                StartDate = DateTime.UtcNow.AddDays(15),
                EndDate = DateTime.UtcNow.AddDays(15),
                Venue = "Grand Hotel, Chicago",
                Price = 149.99m,
                CategoryId = 2,
                // EventTags = new List<EventTag> { new() { TagId = tags[3].Id } },
                ImageUrl = "/uploads/business-networking.jpg"
            },
            new()
            {
                Title = "Art Exhibition",
                Description = "Contemporary art exhibition featuring local artists",
                StartDate = DateTime.UtcNow.AddDays(45),
                EndDate = DateTime.UtcNow.AddDays(60),
                Venue = "Modern Art Museum, Los Angeles",
                Price = 25.00m,
                CategoryId = 3,
                // EventTags = new List<EventTag> { new() { TagId = tags[4].Id } },
                ImageUrl = "/uploads/art-exhibition.jpg"
            },
            
                new() { Title = "AI Summit 2024", Description = "Explore the future of Artificial Intelligence", StartDate = DateTime.UtcNow.AddDays(20), EndDate = DateTime.UtcNow.AddDays(22), Venue = "Tech Hub, San Francisco", Price = 399.99m, CategoryId = 1, ImageUrl = "/uploads/ai-summit.jpg" },
                new() { Title = "Cloud Expo", Description = "All about cloud computing and services", StartDate = DateTime.UtcNow.AddDays(50), EndDate = DateTime.UtcNow.AddDays(52), Venue = "Cloud Center, Seattle", Price = 249.99m, CategoryId = 1, ImageUrl = "/uploads/cloud-expo.jpg" },
    new() { Title = "Cybersecurity Forum", Description = "Secure your digital future", StartDate = DateTime.UtcNow.AddDays(10), EndDate = DateTime.UtcNow.AddDays(11), Venue = "Cyber Arena, Austin", Price = 199.99m, CategoryId = 1, ImageUrl = "/uploads/cyber-forum.jpg" },
    new() { Title = "VR & AR Experience", Description = "Immersive virtual and augmented reality demos", StartDate = DateTime.UtcNow.AddDays(65), EndDate = DateTime.UtcNow.AddDays(66), Venue = "Tech Zone, Miami", Price = 179.99m, CategoryId = 1, ImageUrl = "/uploads/vr-ar.jpg" },
    new() { Title = "Data Science Bootcamp", Description = "Hands-on data science training", StartDate = DateTime.UtcNow.AddDays(25), EndDate = DateTime.UtcNow.AddDays(30), Venue = "Data Hall, Boston", Price = 299.99m, CategoryId = 1, ImageUrl = "/uploads/data-bootcamp.jpg" },
    new() { Title = "Web Development Hackathon", Description = "Compete in full-stack web projects", StartDate = DateTime.UtcNow.AddDays(18), EndDate = DateTime.UtcNow.AddDays(19), Venue = "CodeSpace, Denver", Price = 99.99m, CategoryId = 1, ImageUrl = "/uploads/web-hackathon.jpg" },

    // Business (CategoryId = 2)
    new() { Title = "Startup Pitch Night", Description = "Pitch your startup to investors", StartDate = DateTime.UtcNow.AddDays(7), EndDate = DateTime.UtcNow.AddDays(7), Venue = "Innovation Hub, NYC", Price = 49.99m, CategoryId = 2, ImageUrl = "/uploads/startup-pitch.jpg" },
    new() { Title = "Finance Masterclass", Description = "Improve your financial literacy", StartDate = DateTime.UtcNow.AddDays(33), EndDate = DateTime.UtcNow.AddDays(35), Venue = "Finance Center, Chicago", Price = 199.00m, CategoryId = 2, ImageUrl = "/uploads/finance-masterclass.jpg" },
    new() { Title = "Leadership Seminar", Description = "Develop leadership skills for success", StartDate = DateTime.UtcNow.AddDays(14), EndDate = DateTime.UtcNow.AddDays(15), Venue = "Leadership Academy, Dallas", Price = 129.99m, CategoryId = 2, ImageUrl = "/uploads/leadership.jpg" },
    new() { Title = "E-commerce Summit", Description = "Grow your online business", StartDate = DateTime.UtcNow.AddDays(28), EndDate = DateTime.UtcNow.AddDays(29), Venue = "Ecom Arena, San Diego", Price = 159.99m, CategoryId = 2, ImageUrl = "/uploads/ecommerce.jpg" },
    new() { Title = "Marketing Trends 2025", Description = "Discover the next big marketing strategies", StartDate = DateTime.UtcNow.AddDays(45), EndDate = DateTime.UtcNow.AddDays(46), Venue = "Marketing Plaza, Atlanta", Price = 179.00m, CategoryId = 2, ImageUrl = "/uploads/marketing.jpg" },
    new() { Title = "Business Innovation Forum", Description = "Drive innovation in your company", StartDate = DateTime.UtcNow.AddDays(60), EndDate = DateTime.UtcNow.AddDays(61), Venue = "BizHall, Phoenix", Price = 209.99m, CategoryId = 2, ImageUrl = "/uploads/business-innovation.jpg" },

    // Arts (CategoryId = 3)
    new() { Title = "Digital Art Festival", Description = "Celebrate the beauty of digital creations", StartDate = DateTime.UtcNow.AddDays(17), EndDate = DateTime.UtcNow.AddDays(18), Venue = "Art Dome, Portland", Price = 40.00m, CategoryId = 3, ImageUrl = "/uploads/digital-art.jpg" },
    new() { Title = "Photography Workshop", Description = "Learn photography from the pros", StartDate = DateTime.UtcNow.AddDays(22), EndDate = DateTime.UtcNow.AddDays(23), Venue = "Studio 54, San Jose", Price = 70.00m, CategoryId = 3, ImageUrl = "/uploads/photography.jpg" },
    new() { Title = "Sculpture Expo", Description = "Showcase of modern sculptures", StartDate = DateTime.UtcNow.AddDays(40), EndDate = DateTime.UtcNow.AddDays(42), Venue = "Art Yard, Detroit", Price = 30.00m, CategoryId = 3, ImageUrl = "/uploads/sculpture.jpg" },
    new() { Title = "Live Painting Gala", Description = "Watch artists create live on stage", StartDate = DateTime.UtcNow.AddDays(29), EndDate = DateTime.UtcNow.AddDays(29), Venue = "Canvas Center, Austin", Price = 50.00m, CategoryId = 3, ImageUrl = "/uploads/live-painting.jpg" },
    new() { Title = "Craft Fair 2025", Description = "Handmade crafts from local artisans", StartDate = DateTime.UtcNow.AddDays(35), EndDate = DateTime.UtcNow.AddDays(36), Venue = "Craft Hall, Nashville", Price = 15.00m, CategoryId = 3, ImageUrl = "/uploads/craft-fair.jpg" },
    new() { Title = "Indie Film Festival", Description = "Screenings of award-winning indie films", StartDate = DateTime.UtcNow.AddDays(55), EndDate = DateTime.UtcNow.AddDays(58), Venue = "Film House, Minneapolis", Price = 60.00m, CategoryId = 3, ImageUrl = "/uploads/indie-film.jpg" },

    // Sports (CategoryId = 4)
    new() { Title = "Marathon 2025", Description = "Run through the city in a competitive marathon", StartDate = DateTime.UtcNow.AddDays(21), EndDate = DateTime.UtcNow.AddDays(21), Venue = "Central Park, NYC", Price = 35.00m, CategoryId = 4, ImageUrl = "/uploads/marathon.jpg" },
    new() { Title = "Basketball Camp", Description = "Training camp for young basketball enthusiasts", StartDate = DateTime.UtcNow.AddDays(30), EndDate = DateTime.UtcNow.AddDays(34), Venue = "Sports Arena, LA", Price = 120.00m, CategoryId = 4, ImageUrl = "/uploads/basketball-camp.jpg" },
    new() { Title = "Surfing Competition", Description = "Ride the waves with the best surfers", StartDate = DateTime.UtcNow.AddDays(48), EndDate = DateTime.UtcNow.AddDays(49), Venue = "Sunset Beach, Hawaii", Price = 80.00m, CategoryId = 4, ImageUrl = "/uploads/surfing.jpg" },
    new() { Title = "Yoga Retreat", Description = "Peaceful retreat with yoga and meditation", StartDate = DateTime.UtcNow.AddDays(38), EndDate = DateTime.UtcNow.AddDays(40), Venue = "Wellness Center, Sedona", Price = 150.00m, CategoryId = 4, ImageUrl = "/uploads/yoga.jpg" },
    new() { Title = "Climbing Challenge", Description = "Rock climbing for all skill levels", StartDate = DateTime.UtcNow.AddDays(62), EndDate = DateTime.UtcNow.AddDays(63), Venue = "ClimbZone, Denver", Price = 65.00m, CategoryId = 4, ImageUrl = "/uploads/climbing.jpg" },
    new() { Title = "Football Tryouts", Description = "Try your luck at making a semi-pro team", StartDate = DateTime.UtcNow.AddDays(13), EndDate = DateTime.UtcNow.AddDays(13), Venue = "Stadium Field, Houston", Price = 25.00m, CategoryId = 4, ImageUrl = "/uploads/football.jpg" },

    // Music (CategoryId = 5)
    new() { Title = "Jazz Night Live", Description = "Enjoy smooth jazz performances", StartDate = DateTime.UtcNow.AddDays(26), EndDate = DateTime.UtcNow.AddDays(26), Venue = "Jazz Club, New Orleans", Price = 55.00m, CategoryId = 5, ImageUrl = "/uploads/jazz-night.jpg" },
    new() { Title = "Rock Festival", Description = "Rock bands from all over the country", StartDate = DateTime.UtcNow.AddDays(37), EndDate = DateTime.UtcNow.AddDays(39), Venue = "Rock Valley, Seattle", Price = 95.00m, CategoryId = 5, ImageUrl = "/uploads/rock-fest.jpg" },
    new() { Title = "Classical Music Gala", Description = "An evening with orchestras and soloists", StartDate = DateTime.UtcNow.AddDays(43), EndDate = DateTime.UtcNow.AddDays(44), Venue = "Symphony Hall, Boston", Price = 85.00m, CategoryId = 5, ImageUrl = "/uploads/classical.jpg" },
    new() { Title = "Hip-Hop Showcase", Description = "Up-and-coming hip-hop artists", StartDate = DateTime.UtcNow.AddDays(12), EndDate = DateTime.UtcNow.AddDays(12), Venue = "BeatBox Arena, Atlanta", Price = 40.00m, CategoryId = 5, ImageUrl = "/uploads/hiphop.jpg" },
    new() { Title = "Country Music Fair", Description = "Top country artists and fun", StartDate = DateTime.UtcNow.AddDays(59), EndDate = DateTime.UtcNow.AddDays(60), Venue = "Country Grounds, Nashville", Price = 75.00m, CategoryId = 5, ImageUrl = "/uploads/country.jpg" },
    new() { Title = "Electronic Beats", Description = "EDM DJs performing live sets", StartDate = DateTime.UtcNow.AddDays(36), EndDate = DateTime.UtcNow.AddDays(36), Venue = "Club X, Las Vegas", Price = 100.00m, CategoryId = 5, ImageUrl = "/uploads/edm.jpg" },
        };

        foreach (var evt in events)
        {
            var existingEvent = await _eventRepository.GetByTitleAsync(evt.Title);
            if (existingEvent == null)
                await _eventRepository.AddAsync(evt);
        }
    }
} 