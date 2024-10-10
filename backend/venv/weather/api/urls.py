#from django.conf.urls import url
from django.urls import path, include
from .views import PairListView, DummyView

urlpatterns = [
    path("", DummyView.as_view())
]