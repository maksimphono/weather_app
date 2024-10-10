from rest_framework import serializers
from .models import Pair

class PairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pair
        fields = ["key", "val"]

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
class SimpleWeatherSerializer(serializers.Serializer):
    timezone = serializers.IntegerField()
    weather_condition = serializers.CharField(max_length = 16)