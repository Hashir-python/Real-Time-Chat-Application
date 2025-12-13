from django.db import models
from django.contrib.auth.models import User
from django.db.models import Prefetch

# Manager to optimize prefetching
class conversationManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().prefetch_related(
            Prefetch('participants', queryset=User.objects.only('id', 'username'))
        )

class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversation')
    created_at = models.DateTimeField(auto_now_add=True)
    objects = conversationManager()

    def __str__(self):
        participants_name = ','.join([user.username for user in self.participants.all()])
        return f'Conversation with {participants_name}'


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender.username} : {self.content[:20]}'
