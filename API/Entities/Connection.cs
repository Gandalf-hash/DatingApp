namespace API.Entities
{
    public class Connection
    {
        public Connection(string connectionId)
        {
            
        }
        public Connection(int connectionId, int username)
        {
            ConnectionId = connectionId;
            Username = username;
        }

        public int ConnectionId { get; set; }
        public int Username { get; set; }
    }
}