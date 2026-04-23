from django.urls import path
from .views import WelcomeAPIView, CSRFTokenAPIView

urlpatterns = [
    path('welcome/', WelcomeAPIView.as_view(), name='welcome-api'),
    path('csrf/', CSRFTokenAPIView.as_view(), name='csrf-token'),
]