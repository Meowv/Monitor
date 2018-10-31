using System.ComponentModel.DataAnnotations.Schema;

namespace IntelligentMonitor.Models.ChartsDic
{
    [Table("chartsdic")]
    public class ChartsDic
    {
        public int Id { get; set; }

        public string Key { get; set; }

        public string Value { get; set; }
    }
}