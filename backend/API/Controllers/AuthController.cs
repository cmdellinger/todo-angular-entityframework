using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<AppUser> userManager,
                                SignInManager<AppUser> signInManager,
                                ITokenService tokenService)
                                : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<ReturnUserDto>> Register(RegisterDto registerDto)
        {
            var newUser = new AppUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };
            
            var registerAttempt = await userManager.CreateAsync(newUser, registerDto.Password);

            if (!registerAttempt.Succeeded) return BadRequest(registerAttempt.Errors);

            return new ReturnUserDto
            {
                Username = newUser.UserName,
                Email = newUser.Email,
                Token = tokenService.CreateToken(newUser)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<ReturnUserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized("Invalid email");

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized("Invalid password");

            return new ReturnUserDto
            {
                Username = user.UserName!,
                Email = user.Email!,
                Token = tokenService.CreateToken(user)
            };
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok();
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<ReturnUserDto>> GetCurrentUser()
        {
            var user = await userManager.FindByEmailAsync(User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value!);

            if (user == null) return Unauthorized();

            return new ReturnUserDto
            {
                Username = user.UserName!,
                Email = user.Email!,
                Token = tokenService.CreateToken(user)
            };
        }
    }
}
