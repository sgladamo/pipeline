namespace SA.Shield.Core.Authentication
{
    public static class AuthenticationService
    {
        private const string Password = "cap9087";

        public static bool Login(string password) => password == Password;
    }
}
