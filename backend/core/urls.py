from django.urls import path
from .views import WelcomeAPIView

urlpatterns = [
    path('welcome/', WelcomeAPIView.as_view(), name='welcome-api'),
]