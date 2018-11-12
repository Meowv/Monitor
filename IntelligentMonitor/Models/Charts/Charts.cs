using System;

namespace IntelligentMonitor.Models.Charts
{
    public class Charts
    {
        public int Id { get; set; }

        public string ChartsName { get; set; }

        public int ItemId { get; set; }

        public string TimeFrom { get; set; }

        public string TimeTill { get; set; }

        public string ItemName { get; set; }

        public int IsDelete { get; set; }

        public DateTime CreateTime { get; set; }

        public int Seq { get; set; }
    }
}