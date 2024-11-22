import time
import requests

res = requests.get("https://api.openweathermap.org/data/2.5/weather?lat=33.44&lon=-94.04&appid=b2c7e53d740b18010af6e34dadf39662")

with open("current_weather.json", "w") as file:
    print(res.json(), file = file)