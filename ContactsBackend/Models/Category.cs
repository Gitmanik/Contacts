using System.ComponentModel.DataAnnotations;

namespace ContactsBackend.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    
    public bool AllowsSubcategories { get; set; }
    
    public bool AllowsCustomSubcategory { get; set; }
    
    public ICollection<Subcategory> Subcategories { get; set; }
    public ICollection<Contact> Contacts { get; set; }
}
