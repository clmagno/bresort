from django.urls import path
from .consumers import DashBoardConsumer

websocket_urlpatterns = [
    path('ws/realtime/', DashBoardConsumer.as_asgi()),
]