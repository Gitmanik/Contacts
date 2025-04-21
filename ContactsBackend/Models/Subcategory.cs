using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ContactsBackend.Models;

public class Subcategory
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    
    public int CategoryId { get; set; }
    
    [JsonIgnore]
    public Category? Category { get; set; }
    
    [JsonIgnore]
    public ICollection<Contact> Contacts { get; set; }
}
