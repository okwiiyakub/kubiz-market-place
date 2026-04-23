from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.response import Response
from rest_framework.views import APIView


@method_decorator(ensure_csrf_cookie, name='dispatch')
class WelcomeAPIView(APIView):
    def get(self, request):
        return Response({
            "message": "Welcome to Kubiz Market Place API"
        })


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFTokenAPIView(APIView):
    def get(self, request):
        return Response({"detail": "CSRF cookie set"})