namespace IntelligentMonitor.Models.Users
{
    public class LoginViewModel
    {
        public string UserName { get; set; }

        public string Password { get; set; }
    }

    public class PasswordViewModel
    {
        public string OldPassword { get; set; }

        public string Password { get; set; }

        public string Repassword { get; set; }
    }

    public class ProfileViewModel
    {

    }
}