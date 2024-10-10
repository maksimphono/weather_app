#from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Pair
from .serializers import PairSerializer
from time import time

# Create your views here.

class PairListView(APIView):
    #permission_classes = [permissions.isAuthenticated]

    def get(self, request, *args, **kwargs):
        pairs = Pair.objects.all()
        serializer = PairSerializer(pairs, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = {
            "key" : f"Key_{time.time()}",
            "val" : time.time()
        }
        serializer = PairSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class DummyView(APIView):
    def get(self, request, *args, **kwargs):
        return Response("Qwerty", status = status.HTTP_200_OK)