import time
import requests

res = requests.get("http://api.openweathermap.org/geo/1.0/direct?q=Mwpouiuy&limit=1&appid=b2c7e53d740b18010af6e34dadf39662")
print(res.json())

#with open("geocoding.json", "w", encoding="utf-8") as file:
#    print(res.json(), file = file)