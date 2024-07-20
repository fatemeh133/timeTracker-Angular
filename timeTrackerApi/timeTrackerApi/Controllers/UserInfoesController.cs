using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UsersApi.Models;
using System.IO;
using UsersApi.Moleds;
using timeTrackerApi.DTOs;

namespace UsersApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserInfoesController : ControllerBase
    {

        private readonly UserDbContext _context;

        public UserInfoesController(UserDbContext context)
        {
            _context = context;
        }

        // GET: api/UserInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserInfo>>> GetUsers()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            return await _context.Users.ToListAsync();
        }

        // GET: api/UserInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserInfo>> GetUserInfo(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var userInfo = await _context.Users.FindAsync(id);

            if (userInfo == null)
            {
                return NotFound();
            }

            return userInfo;
        }

        // PUT: api/UserInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserInfo(int id, [FromForm] UserDto userDto)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }

            var userInfo = await _context.Users.FindAsync(id);

            if (userInfo == null)
            {
                return NotFound();
            }

            userInfo.NameOfUser = userDto.NameOfUser;
            userInfo.codeMeli = userDto.CodeMeli;
            userInfo.userName = userDto.UserName;
            userInfo.birthDate = userDto.BirthDate;
            userInfo.password = userDto.Password;

            if (userDto.ProfilePicture != null)
            {
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + userDto.ProfilePicture.FileName;
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                Directory.CreateDirectory(uploadsFolder);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await userDto.ProfilePicture.CopyToAsync(fileStream);
                }

                userInfo.ProfilePicturePath = $"{Request.Scheme}://{Request.Host}"+"/images/" + uniqueFileName;
            }

            _context.Entry(userInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/UserInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserInfo>> PostUserInfo([FromForm] UserDto userDto)


        {
             if (!ModelState.IsValid)
    {
        // Log the error details
        var errors = ModelState.Values.SelectMany(v => v.Errors);
        foreach (var error in errors)
        {
            Console.WriteLine(error.ErrorMessage);
        }
        return BadRequest(ModelState);
    }
            if (_context.Users == null)
            {
                return Problem("Entity set 'UserDbContext.Users' is null.");
            }

            var userInfo = new UserInfo
            {
                NameOfUser = userDto.NameOfUser,
                codeMeli = userDto.CodeMeli,
                userName = userDto.UserName,
                birthDate = userDto.BirthDate,
                password = userDto.Password,
          
            };

            if (userDto.ProfilePicture != null)
            {
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + userDto.ProfilePicture.FileName;
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                Directory.CreateDirectory(uploadsFolder);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await userDto.ProfilePicture.CopyToAsync(fileStream);
                }

                userInfo.ProfilePicturePath = $"{Request.Scheme}://{Request.Host}"+"/images/" + uniqueFileName;
            }

            _context.Users.Add(userInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserInfo", new { id = userInfo.userId }, userInfo);
        }

        // DELETE: api/UserInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserInfo(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var userInfo = await _context.Users.FindAsync(id);
            if (userInfo == null)
            {
                return NotFound();
            }

            _context.Users.Remove(userInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Image
        [HttpDelete]
        public async Task<IActionResult> DeleteImage([FromQuery] string imagePath)
        {
            // Adjust the base path to the directory where images are stored
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            var fullPath = Path.Combine(basePath, imagePath);

            if (System.IO.File.Exists(fullPath))
              
            {
                try
                {
                 
                    System.IO.File.Delete(fullPath);

                    // Update database to remove the image path (if necessary)
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.ProfilePicturePath == $"{Request.Scheme}://{Request.Host}" + "/images/" + imagePath);
                    if (user != null)
                    {
                        user.ProfilePicturePath = null;
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                    }

                    return Ok(new { message = "Image deleted successfully." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while deleting the image.", error = ex.Message });
                }
            }
            else
            {
                return NotFound(new { message = "Image not found." });
            }
        }
    


    private bool UserInfoExists(int id)
        {
            return (_context.Users?.Any(e => e.userId == id)).GetValueOrDefault();
        }
    }
}
