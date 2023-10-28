using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Xml.Linq;

namespace Prometh.Hubs
{
    public class ChatHub : Hub
    {
        static List<User> Users = new List<User>();
        static List<string> rooms = new List<string>();

        // This method will send notification to all clients
        // if client have to communicate, it will call <SendMessage()> method
        // if client have to receive notification from server, it will use <ReceiveMessage> method
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }


        public Task SendMessageToGroup(string sender, string receiver, string message)
        {
            return Clients.Group(receiver).SendAsync("ReceiveMessage", sender, message);
        }

        // Everyone notified except the new person that joins
        public async Task JoinChat(string user, string message)
        {
            await Clients.Others.SendAsync("ReceiveMessage", user, message);
        }

        // Send to a single user 
        public async Task JoinChatSingle(string user, string receiver,  string message)
        {
            User? foundUser = Users.Find(item => item.UserName == receiver);

            if (foundUser != null)
            {
                await Clients.Clients(new List<string>() { foundUser.UserId, Context.ConnectionId }).SendAsync("ReceiveMessage", user, receiver, message);
            }
        }

        // Send to a single user 
        public async Task sendChatSingle(string user, string receiver, string message)
        {
            User? foundUser = Users.Find(item => item.UserName == receiver);

            if (foundUser != null)
            {
                await Clients.Clients(new List<string>() { foundUser.UserId, Context.ConnectionId }).SendAsync("ReceiveMessage", user, receiver, message);
            }
        }

        public async Task RequestUsersAndGroups()
        {
            List<User> filteredUsers = Users.Where(user => user.UserId != Context.ConnectionId).ToList();

            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveUserAndGroups", filteredUsers, rooms);
        }

        public override async Task OnConnectedAsync()
        {

            

            Console.WriteLine(Context?.GetHttpContext()?.Request.Query["username"]);

            string? username = Context?.GetHttpContext()?.Request.Query["username"];

            string? userId = Context?.ConnectionId;

            var matches = Users.Where(p => p.UserName == username);


            if (matches.Count() > 0 || username == null)
            {
                await Clients.Caller.SendAsync("NameTaken", username);
                return; 
            }
            else
            {
                await Clients.Caller.SendAsync("NameAvailable", username);
            }

            User newUser = new User(userId!, username!);

            Users.Add(newUser);

            Console.WriteLine($"New User: {Users.Count}");
            await Clients.All.SendAsync("ReceiveUserAndGroups", Users, rooms);


            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {

            List<User> filteredUsers = Users.Where(user => user.UserId != Context.ConnectionId).ToList();

            Users = filteredUsers; 

            await Clients.All.SendAsync("ReceiveUserAndGroups", Users, rooms);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(string roomName, string user, string message)
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

            await Clients.GroupExcept(roomName, Context.ConnectionId).SendAsync("ReceiveGroupMessage", message, user);
        }

        public Task LeaveRoom(string roomName)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task CreateGroup(string roomName)
        {
            if (rooms.Contains(roomName))
            {
            await Clients.Caller.SendAsync("RoomAlreadyExists", roomName);
            }
            else
            {
                rooms.Add(roomName);
                await Clients.All.SendAsync("ReceiveUserAndGroups", Users, rooms);
                await Clients.Caller.SendAsync("GroupCreated", Users, rooms);

            }
        }

        public async Task SendMessageToRoom(string roomName, string message, string user)
        {
                await Clients.Group(roomName).SendAsync("ReceiveGroupMessage", message, user);
           
        }
    }

    class User
    {
        public string UserId { get; set; }
        public string UserName { get; set; }

        public User(string userId, string username)
        {
            this.UserId = userId;
            this.UserName = username;
        }
    }
}

