using ContactsBackend.Models;

namespace ContactsBackend.Data;

public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        if (!context.Categories.Any())
        {
            // Main categories
            var business = new Category 
            { 
                Name = "Służbowy", 
                AllowsSubcategories = true, 
                AllowsCustomSubcategory = false 
            };
            
            var private_ = new Category 
            { 
                Name = "Prywatny", 
                AllowsSubcategories = false, 
                AllowsCustomSubcategory = false 
            };
            
            var other = new Category 
            { 
                Name = "Inny", 
                AllowsSubcategories = false, 
                AllowsCustomSubcategory = true 
            };

            context.Categories.AddRange(business, private_, other);
            context.SaveChanges();

            // Subcategories (for Business category)
            var businessSubcategories = new[]
            {
                new Subcategory { Name = "Szef", CategoryId = business.Id },
                new Subcategory { Name = "Klient", CategoryId = business.Id },
                new Subcategory { Name = "Współpracownik", CategoryId = business.Id },
                new Subcategory { Name = "Dostawca", CategoryId = business.Id },
                new Subcategory { Name = "Partner biznesowy", CategoryId = business.Id }
            };

            context.Subcategories.AddRange(businessSubcategories);
            context.SaveChanges();
        }
    }
}