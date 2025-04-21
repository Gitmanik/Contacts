using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ContactsBackend.Models.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ContactsBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] Register model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (model.Password != model.ConfirmPassword)
        {
            return BadRequest(new AuthResponse { 
                Success = false, 
                Message = "Passwords do not match." 
            });
        }

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            return Ok(new AuthResponse { 
                Success = true, 
                Message = "Registration completed successfully."
            });
        }
    
        return BadRequest(new AuthResponse { 
            Success = false, 
            Message = "Registration error: " + string.Join(", ", result.Errors.Select(e => e.Description)) 
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Login model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
    
        if (user == null)
        {
            return Unauthorized(new AuthResponse { 
                Success = false, 
                Message = "Invalid email or password."
            });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: true);
    
        if (result.Succeeded)
        {
            var token = GenerateJwtToken(user);
        
            return Ok(new AuthResponse { 
                Success = true, 
                Token = token.token,
                UserId = user.Id,
                Email = user.Email,
                Expiration = token.expiration,
                Message = "Login successful."
            });
        }
    
        if (result.IsLockedOut)
        {
            return Unauthorized(new AuthResponse { 
                Success = false, 
                Message = "Account temporarily locked. Please try again later."
            });
        }
    
        return Unauthorized(new AuthResponse { 
            Success = false, 
            Message = "Invalid email or password."
        });
    }

    private (string token, DateTime expiration) GenerateJwtToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpiryInMinutes"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }
}