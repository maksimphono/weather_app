#from django.conf.urls import url
from django.urls import path, include
from .views import SimpleWeatherView, CoordinatesWeatherView

urlpatterns = [
    path("", SimpleWeatherView.as_view()),
    path("coords", CoordinatesWeatherView.as_view())
]