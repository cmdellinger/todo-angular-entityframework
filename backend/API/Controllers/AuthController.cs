using System.Security.Claims;
using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<AppUser> userManager,
                                SignInManager<AppUser> signInManager,
                                ITokenService tokenService,
                                IConfiguration config)
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

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleCallback")
            };

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var result = await HttpContext.AuthenticateAsync("Cookies");
            if (!result.Succeeded) return Unauthorized();

            var username = result.Principal.FindFirstValue(ClaimTypes.Name);
            var email = result.Principal.FindFirstValue(ClaimTypes.Email);

            // check if registered
            var user = await userManager.FindByEmailAsync(email!);
            // if user doesn't exist create one in database
            if (user == null)
            {
                var newUser = new AppUser
                {
                    UserName = username?.Replace(" ", "") ?? email!.Split('@')[0],
                    Email = email
                };

                // create user in db "in-place" (edits AppUser instance)
                var createResult = await userManager.CreateAsync(newUser);
                if (!createResult.Succeeded) return BadRequest(createResult.Errors);
                user = newUser;
            }

            // clear the temporary cookie
            await HttpContext.SignOutAsync("Cookies");
            //issue jwt
            var token = tokenService.CreateToken(user!);
            return Redirect($"{config["FrontendUrl"]}/login?token={token}");
        }
    }
}
