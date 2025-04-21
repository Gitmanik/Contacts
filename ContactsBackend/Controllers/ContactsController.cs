using ContactsBackend.Data;
using ContactsBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactsBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ContactsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/contacts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
    {
        return await _context.Contacts
            .Include(c => c.Category)
            .Include(c => c.Subcategory)
            .ToListAsync();
    }

    // GET: api/contacts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Contact>> GetContact(int id)
    {
        var contact = await _context.Contacts
            .Include(c => c.Category)
            .Include(c => c.Subcategory)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (contact == null)
        {
            return NotFound();
        }

        return contact;
    }

    // POST: api/contacts
    [HttpPost]
    public async Task<ActionResult<Contact>> CreateContact(Contact contact)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Get category
        var category = await _context.Categories.FindAsync(contact.CategoryId);
        if (category == null)
        {
            return BadRequest("Podana kategoria nie istnieje");
        }
        contact.Category = category;

        // Get subcategory if provided
        if (contact.SubcategoryId.HasValue)
        {
            var subcategory = await _context.Subcategories.FindAsync(contact.SubcategoryId);
            if (subcategory == null)
            {
                return BadRequest("Podana podkategoria nie istnieje");
            }
            if (subcategory.CategoryId != contact.CategoryId)
            {
                return BadRequest("Podana podkategoria nie należy do wybranej kategorii");
            }
            contact.Subcategory = subcategory;
        }

        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        // Load relations
        await _context.Entry(contact)
            .Reference(c => c.Category)
            .LoadAsync();
        
        if (contact.SubcategoryId.HasValue)
        {
            await _context.Entry(contact)
                .Reference(c => c.Subcategory)
                .LoadAsync();
        }

        return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
    }

    // PUT: api/contacts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContact(int id, Contact contact)
    {
        if (id != contact.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if category exists
        var category = await _context.Categories.FindAsync(contact.CategoryId);
        if (category == null)
        {
            return BadRequest("Podana kategoria nie istnieje");
        }
        contact.Category = category;

        if (contact.SubcategoryId.HasValue)
        {
            var subcategory = await _context.Subcategories.FindAsync(contact.SubcategoryId);
            if (subcategory == null)
            {
                return BadRequest("Podana podkategoria nie istnieje");
            }
            if (subcategory.CategoryId != contact.CategoryId)
            {
                return BadRequest("Podana podkategoria nie należy do wybranej kategorii");
            }
            contact.Subcategory = subcategory;
        }

        try
        {
            var existingContact = await _context.Contacts.FindAsync(id);
            if (existingContact == null)
            {
                return NotFound();
            }

            // Update properties
            _context.Entry(existingContact).CurrentValues.SetValues(contact);
        
            // Update relationships
            existingContact.Category = category;
            existingContact.Subcategory = contact.SubcategoryId.HasValue ? contact.Subcategory : null;

            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ContactExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/contacts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContact(int id)
    {
        var contact = await _context.Contacts.FindAsync(id);
        if (contact == null)
        {
            return NotFound();
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ContactExists(int id)
    {
        return _context.Contacts.Any(e => e.Id == id);
    }
}