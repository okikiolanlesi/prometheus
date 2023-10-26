using Microsoft.AspNetCore.SignalR;

namespace PrometheusChatServer.Hubs
{
    public class ChatHub: Hub
    {
        // This method will send notification to all clients
        // if client have to communicate, it will call <SendMessage()> method
        // if client have to receive notification from server, it will use <ReceiveMessage> method
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        // Everyone notified except the new person that joins
        public async Task JoinChat(string user, string message)
        {
            await Clients.Others.SendAsync("ReceiveMessage", user, message);
        }

    }
}
