#from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Pair
from .serializers import PairSerializer, SimpleWeatherSerializer
from time import time
import requests

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
    

"""
{
    'coord': {
        'lon': 10.99, 
        'lat': 44.34
    }, 
    'weather': 
        [
            {
                'id': 501, 
                'main': 'Rain', 
                'description': 'moderate rain', 
                'icon': '10d'
            }
        ], 
    'base': 'stations', 
    'main': {
        'temp': 290.99, 
        'feels_like': 291.08, 
        'temp_min': 289.43, 
        'temp_max': 292.07, 
        'pressure': 1000, 
        'humidity': 86, 
        'sea_level': 1000, 
        'grnd_level': 934
    }, 
    'visibility': 10000, 
    'wind': {
        'speed': 3.94, 
        'deg': 213, 
        'gust': 11.81
    }, 
    'rain': {'1h': 1.53}, 
    'clouds': {'all': 85}, 
    'dt': 1728557553, 
    'sys': {
        'type': 2, 
        'id': 2004688, 
        'country': 'IT', 
        'sunrise': 1728537890, 
        'sunset': 1728578446
    }, 
    'timezone': 7200, 
    'id': 3163858, 
    'name': 'Zocca', 
    'cod': 200
}
"""

class SimpleWeatherView(View):
    def get(self, request):
        data = {
            'coord': {
                'lon': 10.99, 
                'lat': 44.34
            }, 
            'weather': 
                [
                    {
                        'id': 501, 
                        'main': 'Rain', 
                        'description': 'moderate rain', 
                        'icon': '10d'
                    }
                ], 
            'base': 'stations', 
            'main': {
                'temp': 290.99, 
                'feels_like': 291.08, 
                'temp_min': 289.43, 
                'temp_max': 292.07, 
                'pressure': 1000, 
                'humidity': 86, 
                'sea_level': 1000, 
                'grnd_level': 934
            }, 
            'visibility': 10000, 
            'wind': {
                'speed': 3.94, 
                'deg': 213, 
                'gust': 11.81
            }, 
            'rain': {'1h': 1.53}, 
            'clouds': {'all': 85}, 
            'dt': 1728557553, 
            'sys': {
                'type': 2, 
                'id': 2004688, 
                'country': 'IT', 
                'sunrise': 1728537890, 
                'sunset': 1728578446
            }, 
            'timezone': 7200, 
            'id': 3163858, 
            'name': 'Zocca', 
            'cod': 200
        }

        return JsonResponse(data)