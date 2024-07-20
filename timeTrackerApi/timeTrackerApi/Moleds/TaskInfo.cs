using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UsersApi.Models
{
    public class TaskInfo
    {
        [Key]
        public int TaskId { get; set; }

        [ForeignKey("User")]
        public int userId { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string TaskName { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string duration { get; set; }


        [Column(TypeName = "bit")]
        public bool IsChecked { get; set; } = false;

        [Column(TypeName = "nvarchar(100)")]
        public string date { get; set; }


        //public virtual UserInfo User { get; set; }
    }
}
