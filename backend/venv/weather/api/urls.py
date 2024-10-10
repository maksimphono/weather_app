#from django.conf.urls import url
from django.urls import path, include
from .views import PairListView, SimpleWeatherView

urlpatterns = [
    path("", SimpleWeatherView.as_view())
]