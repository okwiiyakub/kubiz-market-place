from django.urls import path
from .views import RegisterAPIView, LoginAPIView, LogoutAPIView, CurrentUserAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='customer-register'),
    path('login/', LoginAPIView.as_view(), name='customer-login'),
    path('logout/', LogoutAPIView.as_view(), name='customer-logout'),
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),
]