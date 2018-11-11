using System;

namespace IntelligentMonitor.Utility
{
    public class DatetimeUtil
    {
        public static long TimeToUnix(DateTime time)
        {
            return (time.ToUniversalTime().Ticks - 621355968000000000) / 10000000;
        }
    }
}