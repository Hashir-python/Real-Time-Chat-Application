from asgiref.sync import sync_to_async
import json 
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from urllib.parse import parse_qs
from collections import defaultdict

# Global dictionary to track online users per room
room_online_users = defaultdict(set)

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Token authentication
        query_string = self.scope['query_string'].decode('utf-8')
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]

        if token:
            try:
                decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                self.user = await self.get_user(decoded_data['user_id'])
                self.scope['user'] = self.user
            except jwt.ExpiredSignatureError:
                await self.close(code=4000)
                return
            except jwt.InvalidTokenError:
                await self.close(code=4001)
                return
        else:
            await self.close(code=4002)
            return

        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Add to group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Add user to online list for this room
        room_online_users[self.room_group_name].add(self.user.id)

        await self.accept()

        # Send updated online users list to all in room
        await self.broadcast_online_users()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            # Remove user from online list
            if self.room_group_name in room_online_users and self.user.id in room_online_users[self.room_group_name]:
                room_online_users[self.room_group_name].remove(self.user.id)
            
            # If room empty, delete it
            if self.room_group_name in room_online_users and not room_online_users[self.room_group_name]:
                del room_online_users[self.room_group_name]
            
            # Broadcast updated list to remaining users
            if self.room_group_name in room_online_users:
                await self.broadcast_online_users()

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get('type')

        if event_type == 'chat_message':
            message_content = data.get('message')
            user_id = data.get('user')
            user = await self.get_user(user_id)
            conversation = await self.get_conversation(self.conversation_id)
            message = await self.save_message(conversation, user, message_content)
            user_data = await self.get_user_data(user)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message.content,
                    'user': user_data,
                    'timestamp': message.timestamp.isoformat(),
                }
            )

        elif event_type == 'typing':
            user_data = await self.get_user_data(self.scope['user'])
            receiver_id = data.get('receiver')
            if receiver_id != self.scope['user'].id:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'typing',
                        'user': user_data,
                        'receiver': receiver_id,
                    }
                )

    # Send online users list to the room
    async def broadcast_online_users(self):
        if self.room_group_name in room_online_users:
            online_ids = list(room_online_users[self.room_group_name])
            # Get user details for online users
            online_users_data = []
            for user_id in online_ids:
                user = await self.get_user(user_id)
                online_users_data.append(await self.get_user_data(user))
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'online_status',
                    'online_users': online_users_data,  # List of {id, username}
                }
            )

    # Event handlers
    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def typing(self, event):
        await self.send(text_data=json.dumps(event))

    async def online_status(self, event):
        await self.send(text_data=json.dumps(event))

    # Helper functions
    @sync_to_async
    def get_user(self, user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return User.objects.get(id=user_id)

    @sync_to_async
    def get_user_data(self, user):
        return {"id": user.id, "username": user.username}

    @sync_to_async
    def get_conversation(self, conversation_id):
        from .models import Conversation
        return Conversation.objects.get(id=conversation_id)

    @sync_to_async
    def save_message(self, conversation, user, content):
        from .models import Message
        return Message.objects.create(conversation=conversation, sender=user, content=content)









           
           






        


