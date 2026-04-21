from rest_framework.response import Response
from rest_framework.views import APIView


class WelcomeAPIView(APIView):
    def get(self, request):
        return Response({
            "message": "Welcome to Kubiz Market Place API"
        })