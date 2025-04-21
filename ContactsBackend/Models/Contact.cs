using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ContactsBackend.Models;

public class Contact {
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [RegularExpression("^(?=.*[A-Za-z])(?=.*\\d).{8,}$", ErrorMessage = "Hasło musi mieć minimum 8 znaków, przynajmniej jedną literę i jedną cyfrę.")]
    public string Password { get; set; }

    [Required]
    public int CategoryId { get; set; }
    [JsonIgnore]
    public Category? Category { get; set; }
    
    [NotMapped]
    public string? CategoryName { get => Category?.Name; }

    public int? SubcategoryId { get; set; }
    [JsonIgnore]
    public Subcategory? Subcategory { get; set; }
    
    [NotMapped]
    public string? SubcategoryName { get => Subcategory?.Name; }
    
    [StringLength(50)]
    public string? OtherSubcategory { get; set; }

    [Phone]
    public string Phone { get; set; }

    [DataType(DataType.Date)]
    public DateTime? BirthDate { get; set; }
}