using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UsersApi.Moleds
{
    public class UserInfo
    {
        [Key]
        public int userId { get; set; }


        [Column(TypeName = "nvarchar(100)")]
        public string NameOfUser { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string codeMeli { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string userName { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string birthDate { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string password { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string? ProfilePicturePath { get; set; }

        //public virtual ICollection<TaskInfo> Tasks { get; set; }
    }
}
