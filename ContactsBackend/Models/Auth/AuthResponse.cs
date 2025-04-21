namespace ContactsBackend.Models.Auth;

public class AuthResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string Token { get; set; }
    public string UserId { get; set; }
    public string Email { get; set; }
    public DateTime Expiration { get; set; }
}