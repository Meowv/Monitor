namespace IntelligentMonitor.Models.JsonResult
{
    public class JsonResult<T>
    {
        public int Code { get; set; }

        public string Msg { get; set; }

        public int Count { get; set; }

        public T Data { get; set; }
    }
}