using ContactsBackend.Data;
using ContactsBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactsBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubcategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SubcategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/subcategories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Subcategory>>> GetSubcategories()
    {
        return await _context.Subcategories.ToListAsync();
    }

    // GET: api/subcategories/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Subcategory>> GetSubcategory(int id)
    {
        var subcategory = await _context.Subcategories
            .Include(s => s.Category)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (subcategory == null)
        {
            return NotFound();
        }

        return subcategory;
    }

    // GET: api/subcategories/Category/5
    [HttpGet("Category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<Subcategory>>> GetSubcategoriesByCategory(int categoryId)
    {
        return await _context.Subcategories
            .Where(s => s.CategoryId == categoryId)
            .ToListAsync();
    }
    private bool SubcategoryExists(int id)
    {
        return _context.Subcategories.Any(e => e.Id == id);
    }
}