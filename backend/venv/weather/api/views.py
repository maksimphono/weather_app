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
import os
from dotenv import load_dotenv

# Create your views here. 

load_dotenv()
API_KEY = os.environ.get("API_KEY")

EXAMPLE_RESPONSE_DATA = {
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


class SimpleWeatherView(View):
    def get(self, request):
        #print(request.GET)
        #req = requests.get("https://api.openweathermap.org/data/2.5/weather", params = {"lat" : 43.1056, "lon" : 131.87353, "appid" : API_KEY})

        #   artifical response (delete later) !!!
        data = EXAMPLE_RESPONSE_DATA

        return JsonResponse(data)
    
class CoordinatesWeatherView(View):
    
    def get(self, request):
        lat = request.GET.get("lat")
        lon = request.GET.get("lon")

        #req = requests.get("https://api.openweathermap.org/data/2.5/weather", params = {"lat" : lat, "lon" : lon, "appid" : API_KEY})
        #data = dict(req.json())

        #   artifical response (delete later) !!!
        data = EXAMPLE_RESPONSE_DATA
        data["lat"] = lat
        data["lon"] = lon

        return JsonResponse(data)
