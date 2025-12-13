# Real-Time-Chat-Application

This repository contains all the resources needed to build a robust, real-time chat system using Django for the backend and React for the frontend. The system supports real-time messaging, online status indicators, typing indicators, and user authentication.

Key Features
Backend:
WebSocket Integration: Utilizes Django Channels to support WebSocket connections for real-time messaging.
Redis: Acts as the message broker to enable WebSocket functionality and handle asynchronous events.
Daphne: A production-ready ASGI server used to serve WebSocket and HTTP traffic.
Message Persistence: Messages are stored in a PostgreSQL or SQLite database using Django ORM.
Authentication: Supports token-based authentication for secure communication.
Online and Typing Indicators: Real-time updates for online users and typing notifications.
Role-based Access: Ensures users can only access conversations they are part of.
Frontend:
Real-Time Updates: Leverages WebSocket to provide instant message delivery.
User Interface: Built using React with a clean and responsive design.
Online Status Display: Shows a list of online users in the conversation.
Typing Indicators: Displays when another user is typing in the conversation.
Authentication and Authorization: Uses JWT for managing user sessions.
Error Handling: Graceful handling of network and server errors.


=========What You Need to Know About WebSocket
WebSocket provides a persistent connection between the client and server, enabling bi-directional communication without waiting for a server response like HTTP. This is crucial for achieving real-time functionality.

To set up WebSocket in Django:

Install the Django Channels library:
pip install channels_redis
pip install daphne 
Update your settings.py to configure Channels and Redis:
INSTALLED_APPS = [
    ...
    'channels',
]

ASGI_APPLICATION = "chatsystemproj.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
Ensure you have a running Redis server:
sudo apt install redis-server
sudo service redis-server start
redis-cli ping  # Should return PONG
Project Structure
Backend:
chatapp/: Contains the core logic for managing conversations and messages.
chatsystemproj/: The Django project folder, including settings and ASGI configuration.
asgi.py: Configures the ASGI application to handle WebSocket connections.
consumers.py: Implements WebSocket consumers for handling real-time communication.
Frontend:
React Components:
Conversation.jsx: Manages real-time chat UI and WebSocket communication.
Login.jsx and Register.jsx: Handles user authentication.
ChatList.jsx: Displays the list of conversations.
CSS Styles: Custom styles for a responsive and user-friendly interface.
Getting Started
Prerequisites
Python 3.8+
Node.js 14+
Redis
PostgreSQL (or SQLite for local development)
Backend Setup
Create a Virtual Environment:
python -m venv env
Activate the Virtual Environment:
On Windows:
.\env\Scripts\activate
On macOS/Linux:
source env/bin/activate
Navigate to the Backend Directory:
cd chatsystemproj
Install Dependencies:
pip install -r requirements.txt
Run Migrations:
python manage.py migrate
Run the Development Server:
python manage.py runserver
Run Daphne (for WebSocket support):
daphne -b 0.0.0.0 -p 8000 chatsystemproj.asgi:application
Frontend Setup
Navigate to the Frontend Directory:
cd frontend
Install Dependencies:
npm install
Start the Development Server:
npm run dev
Key Components
Backend:
WebSocket Consumers: Handles incoming and outgoing WebSocket messages, including:

Message broadcasting.
Typing notifications.
Online user status updates.
REST API: Provides endpoints for:

Fetching conversation messages.
Creating new messages.
Managing user authentication.
Frontend:
WebSocket Client:

Connects to the backend WebSocket server.
Sends and receives real-time events (messages, typing indicators).
Message List: Displays messages with a distinction between sent and received messages.

Typing Indicator: Displays the name of the user typing in the chat.

Additional Feature to Explore
Message Deletion: Enable users to delete messages from conversations.
