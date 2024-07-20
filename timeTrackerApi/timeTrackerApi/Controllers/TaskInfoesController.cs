using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UsersApi.Models;
using UsersApi.Moleds;

namespace timeTrackerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskInfoesController : ControllerBase
    {
        private readonly UserDbContext _context;

        public TaskInfoesController(UserDbContext context)
        {
            _context = context;
        }

        // GET: api/TaskInfoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskInfo>>> GetTasks()
        {
          if (_context.Tasks == null)
          {
              return NotFound();
          }
            return await _context.Tasks.ToListAsync();
        }

        // GET: api/TaskInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskInfo>> GetTaskInfo(int id)
        {
          if (_context.Tasks == null)
          {
              return NotFound();
          }
            var taskInfo = await _context.Tasks.FindAsync(id);

            if (taskInfo == null)
            {
                return NotFound();
            }

            return taskInfo;
        }

        // PUT: api/TaskInfoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskInfo(int id, TaskInfo taskInfo)
        {
            if (id != taskInfo.TaskId)
            {
                return BadRequest();
            }

            _context.Entry(taskInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskInfoExists(id))
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

        // POST: api/TaskInfoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TaskInfo>> PostTaskInfo(TaskInfo taskInfo)
        {
          if (_context.Tasks == null)
          {
              return Problem("Entity set 'UserDbContext.Tasks'  is null.");
          }
            _context.Tasks.Add(taskInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTaskInfo", new { id = taskInfo.TaskId }, taskInfo);
        }

        // DELETE: api/TaskInfoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskInfo(int id)
        {
            if (_context.Tasks == null)
            {
                return NotFound();
            }
            var taskInfo = await _context.Tasks.FindAsync(id);
            if (taskInfo == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(taskInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskInfoExists(int id)
        {
            return (_context.Tasks?.Any(e => e.TaskId == id)).GetValueOrDefault();
        }
    }
}
