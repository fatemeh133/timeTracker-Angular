namespace timeTrackerApi.DTOs
{
    public class UserDto
    {
        public string NameOfUser { get; set; }
        public string CodeMeli { get; set; }
        public string UserName { get; set; }
        public string BirthDate { get; set; }
        public string Password { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}
