using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ContactsBackend.Models;

public class Category
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    
    public bool AllowsSubcategories { get; set; }
    
    public bool AllowsCustomSubcategory { get; set; }
    
    [JsonIgnore]
    public ICollection<Subcategory> Subcategories { get; set; }
    
    [JsonIgnore]
    public ICollection<Contact> Contacts { get; set; }
}
