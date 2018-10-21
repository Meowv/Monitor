using System;
using System.Security.Cryptography;
using System.Text;

namespace IntelligentMonitor.Utility
{
    public class MD5Util
    {
        public static string TextToMD5(string text)
        {
            using (var md5 = MD5.Create())
            {
                var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(text));
                return BitConverter.ToString(bytes).Replace("-", "");
            }
        }
    }
}