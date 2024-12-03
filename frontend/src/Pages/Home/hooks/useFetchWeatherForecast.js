import React, {useState, useEffect} from "react"
import forecastWeatherDataManager from "../DataManager/ForecastWeatherDataManager"
import geodecodeDataManager from "../DataManager/GeodecodeDataManager"
import { CityError } from "../DataManager/GeodecodeDataManager"
import { CoordinatesError } from "../DataManager/ForecastWeatherDataManager"


const forecast = [
    {
      "dt": 1732276800,
      "main": {
        "temp": 279.77,
        "feels_like": 275.72,
        "temp_min": 279.46,
        "temp_max": 279.77,
        "pressure": 1004,
        "sea_level": 1004,
        "grnd_level": 936,
        "humidity": 42,
        "temp_kf": 0.31
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "clouds": { "all": 44 },
      "wind": { "speed": 7.06, "deg": 303, "gust": 13.64 },
      "visibility": 10000,
      "pop": 0.32,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-22 12:00:00"
    },
    {
      "dt": 1732287600,
      "main": {
        "temp": 279.2,
        "feels_like": 276.19,
        "temp_min": 278.07,
        "temp_max": 279.2,
        "pressure": 1005,
        "sea_level": 1005,
        "grnd_level": 939,
        "humidity": 43,
        "temp_kf": 1.13
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "clouds": { "all": 29 },
      "wind": { "speed": 4.21, "deg": 301, "gust": 11.61 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-22 15:00:00"
    },
    {
      "dt": 1732298400,
      "main": {
        "temp": 277.06,
        "feels_like": 274.59,
        "temp_min": 275.71,
        "temp_max": 277.06,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 943,
        "humidity": 40,
        "temp_kf": 1.35
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "clouds": { "all": 33 },
      "wind": { "speed": 2.69, "deg": 274, "gust": 8.53 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-22 18:00:00"
    },
    {
      "dt": 1732309200,
      "main": {
        "temp": 274.4,
        "feels_like": 271.65,
        "temp_min": 274.4,
        "temp_max": 274.4,
        "pressure": 1018,
        "sea_level": 1018,
        "grnd_level": 947,
        "humidity": 40,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "clouds": { "all": 25 },
      "wind": { "speed": 2.46, "deg": 257, "gust": 2.2 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-22 21:00:00"
    },
    {
      "dt": 1732320000,
      "main": {
        "temp": 274.58,
        "feels_like": 271.59,
        "temp_min": 274.58,
        "temp_max": 274.58,
        "pressure": 1020,
        "sea_level": 1020,
        "grnd_level": 950,
        "humidity": 39,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02n"
        }
      ],
      "clouds": { "all": 13 },
      "wind": { "speed": 2.75, "deg": 236, "gust": 2.17 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-23 00:00:00"
    },
    {
      "dt": 1732330800,
      "main": {
        "temp": 274.73,
        "feels_like": 271.78,
        "temp_min": 274.73,
        "temp_max": 274.73,
        "pressure": 1022,
        "sea_level": 1022,
        "grnd_level": 952,
        "humidity": 37,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "clouds": { "all": 0 },
      "wind": { "speed": 2.73, "deg": 222, "gust": 1.52 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-23 03:00:00"
    },
    {
      "dt": 1732341600,
      "main": {
        "temp": 274.8,
        "feels_like": 271.98,
        "temp_min": 274.8,
        "temp_max": 274.8,
        "pressure": 1025,
        "sea_level": 1025,
        "grnd_level": 954,
        "humidity": 34,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "clouds": { "all": 2 },
      "wind": { "speed": 2.61, "deg": 209, "gust": 1.64 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-23 06:00:00"
    },
    {
      "dt": 1732352400,
      "main": {
        "temp": 280.05,
        "feels_like": 280.05,
        "temp_min": 280.05,
        "temp_max": 280.05,
        "pressure": 1026,
        "sea_level": 1026,
        "grnd_level": 957,
        "humidity": 29,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "clouds": { "all": 12 },
      "wind": { "speed": 0.64, "deg": 184, "gust": 1.89 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-23 09:00:00"
    },
    {
      "dt": 1732363200,
      "main": {
        "temp": 281.71,
        "feels_like": 281.71,
        "temp_min": 281.71,
        "temp_max": 281.71,
        "pressure": 1027,
        "sea_level": 1027,
        "grnd_level": 957,
        "humidity": 31,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "clouds": { "all": 19 },
      "wind": { "speed": 0.85, "deg": 91, "gust": 2.16 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-23 12:00:00"
    },
    {
      "dt": 1732374000,
      "main": {
        "temp": 278.03,
        "feels_like": 278.03,
        "temp_min": 278.03,
        "temp_max": 278.03,
        "pressure": 1029,
        "sea_level": 1029,
        "grnd_level": 959,
        "humidity": 55,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "clouds": { "all": 60 },
      "wind": { "speed": 0.76, "deg": 142, "gust": 1.25 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-23 15:00:00"
    },
    {
      "dt": 1732384800,
      "main": {
        "temp": 275.8,
        "feels_like": 273.19,
        "temp_min": 275.8,
        "temp_max": 275.8,
        "pressure": 1031,
        "sea_level": 1031,
        "grnd_level": 960,
        "humidity": 64,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "clouds": { "all": 50 },
      "wind": { "speed": 2.58, "deg": 203, "gust": 2.76 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-23 18:00:00"
    },
    {
      "dt": 1732395600,
      "main": {
        "temp": 276.35,
        "feels_like": 274.24,
        "temp_min": 276.35,
        "temp_max": 276.35,
        "pressure": 1032,
        "sea_level": 1032,
        "grnd_level": 961,
        "humidity": 69,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 91 },
      "wind": { "speed": 2.17, "deg": 205, "gust": 3.42 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-23 21:00:00"
    },
    {
      "dt": 1732406400,
      "main": {
        "temp": 276.93,
        "feels_like": 275.61,
        "temp_min": 276.93,
        "temp_max": 276.93,
        "pressure": 1032,
        "sea_level": 1032,
        "grnd_level": 961,
        "humidity": 69,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 94 },
      "wind": { "speed": 1.57, "deg": 204, "gust": 3.07 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-24 00:00:00"
    },
    {
      "dt": 1732417200,
      "main": {
        "temp": 276.7,
        "feels_like": 275.29,
        "temp_min": 276.7,
        "temp_max": 276.7,
        "pressure": 1032,
        "sea_level": 1032,
        "grnd_level": 961,
        "humidity": 75,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 99 },
      "wind": { "speed": 1.61, "deg": 193, "gust": 1.93 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-24 03:00:00"
    },
    {
      "dt": 1732428000,
      "main": {
        "temp": 277.81,
        "feels_like": 277.81,
        "temp_min": 277.81,
        "temp_max": 277.81,
        "pressure": 1032,
        "sea_level": 1032,
        "grnd_level": 962,
        "humidity": 78,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.75, "deg": 191, "gust": 1.41 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-24 06:00:00"
    },
    {
      "dt": 1732438800,
      "main": {
        "temp": 278.49,
        "feels_like": 278.49,
        "temp_min": 278.49,
        "temp_max": 278.49,
        "pressure": 1033,
        "sea_level": 1033,
        "grnd_level": 963,
        "humidity": 82,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.48, "deg": 188, "gust": 1.78 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-24 09:00:00"
    },
    {
      "dt": 1732449600,
      "main": {
        "temp": 279.81,
        "feels_like": 279.81,
        "temp_min": 279.81,
        "temp_max": 279.81,
        "pressure": 1033,
        "sea_level": 1033,
        "grnd_level": 963,
        "humidity": 80,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.48, "deg": 158, "gust": 2.76 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-24 12:00:00"
    },
    {
      "dt": 1732460400,
      "main": {
        "temp": 279.6,
        "feels_like": 279.6,
        "temp_min": 279.6,
        "temp_max": 279.6,
        "pressure": 1032,
        "sea_level": 1032,
        "grnd_level": 962,
        "humidity": 84,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.54, "deg": 117, "gust": 1.94 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-24 15:00:00"
    },
    {
      "dt": 1732471200,
      "main": {
        "temp": 279.13,
        "feels_like": 279.13,
        "temp_min": 279.13,
        "temp_max": 279.13,
        "pressure": 1032,
        "sea_level": 1032,
        "grnd_level": 962,
        "humidity": 87,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 1.03, "deg": 163, "gust": 1.67 },
      "visibility": 10000,
      "pop": 0.2,
      "rain": { "3h": 0.15 },
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-24 18:00:00"
    },
    {
      "dt": 1732482000,
      "main": {
        "temp": 279.26,
        "feels_like": 279.26,
        "temp_min": 279.26,
        "temp_max": 279.26,
        "pressure": 1032,
        "sea_level": 1032,
        "grnd_level": 962,
        "humidity": 87,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 99 },
      "wind": { "speed": 0.95, "deg": 169, "gust": 2.09 },
      "visibility": 10000,
      "pop": 0.07,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-24 21:00:00"
    },
    {
      "dt": 1732492800,
      "main": {
        "temp": 279.15,
        "feels_like": 279.15,
        "temp_min": 279.15,
        "temp_max": 279.15,
        "pressure": 1031,
        "sea_level": 1031,
        "grnd_level": 961,
        "humidity": 86,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.92, "deg": 176, "gust": 1.75 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-25 00:00:00"
    },
    {
      "dt": 1732503600,
      "main": {
        "temp": 278.2,
        "feels_like": 278.2,
        "temp_min": 278.2,
        "temp_max": 278.2,
        "pressure": 1030,
        "sea_level": 1030,
        "grnd_level": 960,
        "humidity": 89,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 74 },
      "wind": { "speed": 1.11, "deg": 197, "gust": 1.39 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-25 03:00:00"
    },
    {
      "dt": 1732514400,
      "main": {
        "temp": 277.42,
        "feels_like": 277.42,
        "temp_min": 277.42,
        "temp_max": 277.42,
        "pressure": 1030,
        "sea_level": 1030,
        "grnd_level": 959,
        "humidity": 90,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "clouds": { "all": 46 },
      "wind": { "speed": 1.05, "deg": 198, "gust": 1.15 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-25 06:00:00"
    },
    {
      "dt": 1732525200,
      "main": {
        "temp": 281.84,
        "feels_like": 281.84,
        "temp_min": 281.84,
        "temp_max": 281.84,
        "pressure": 1028,
        "sea_level": 1028,
        "grnd_level": 959,
        "humidity": 79,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "clouds": { "all": 0 },
      "wind": { "speed": 0.66, "deg": 162, "gust": 2.41 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-25 09:00:00"
    },
    {
      "dt": 1732536000,
      "main": {
        "temp": 284.28,
        "feels_like": 283.33,
        "temp_min": 284.28,
        "temp_max": 284.28,
        "pressure": 1026,
        "sea_level": 1026,
        "grnd_level": 957,
        "humidity": 72,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "clouds": { "all": 0 },
      "wind": { "speed": 0.85, "deg": 124, "gust": 2.45 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-25 12:00:00"
    },
    {
      "dt": 1732546800,
      "main": {
        "temp": 281.43,
        "feels_like": 281.43,
        "temp_min": 281.43,
        "temp_max": 281.43,
        "pressure": 1025,
        "sea_level": 1025,
        "grnd_level": 956,
        "humidity": 86,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "clouds": { "all": 67 },
      "wind": { "speed": 0.88, "deg": 101, "gust": 1.88 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-25 15:00:00"
    },
    {
      "dt": 1732557600,
      "main": {
        "temp": 279.5,
        "feels_like": 279.5,
        "temp_min": 279.5,
        "temp_max": 279.5,
        "pressure": 1025,
        "sea_level": 1025,
        "grnd_level": 955,
        "humidity": 94,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 60 },
      "wind": { "speed": 1.11, "deg": 171, "gust": 1.87 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-25 18:00:00"
    },
    {
      "dt": 1732568400,
      "main": {
        "temp": 279.82,
        "feels_like": 279.82,
        "temp_min": 279.82,
        "temp_max": 279.82,
        "pressure": 1024,
        "sea_level": 1024,
        "grnd_level": 955,
        "humidity": 95,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 65 },
      "wind": { "speed": 1.29, "deg": 180, "gust": 2.67 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-25 21:00:00"
    },
    {
      "dt": 1732579200,
      "main": {
        "temp": 280.5,
        "feels_like": 280.5,
        "temp_min": 280.5,
        "temp_max": 280.5,
        "pressure": 1023,
        "sea_level": 1023,
        "grnd_level": 954,
        "humidity": 95,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 61 },
      "wind": { "speed": 0.76, "deg": 186, "gust": 2.43 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-26 00:00:00"
    },
    {
      "dt": 1732590000,
      "main": {
        "temp": 280.64,
        "feels_like": 280.64,
        "temp_min": 280.64,
        "temp_max": 280.64,
        "pressure": 1022,
        "sea_level": 1022,
        "grnd_level": 953,
        "humidity": 95,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 95 },
      "wind": { "speed": 0.61, "deg": 166, "gust": 2.06 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-26 03:00:00"
    },
    {
      "dt": 1732600800,
      "main": {
        "temp": 280.57,
        "feels_like": 280.57,
        "temp_min": 280.57,
        "temp_max": 280.57,
        "pressure": 1023,
        "sea_level": 1023,
        "grnd_level": 954,
        "humidity": 96,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": { "all": 94 },
      "wind": { "speed": 0.4, "deg": 50, "gust": 0.33 },
      "visibility": 7848,
      "pop": 0,
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-26 06:00:00"
    },
    {
      "dt": 1732611600,
      "main": {
        "temp": 282.23,
        "feels_like": 282.23,
        "temp_min": 282.23,
        "temp_max": 282.23,
        "pressure": 1023,
        "sea_level": 1023,
        "grnd_level": 955,
        "humidity": 91,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.68, "deg": 62, "gust": 1.55 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-26 09:00:00"
    },
    {
      "dt": 1732622400,
      "main": {
        "temp": 281.75,
        "feels_like": 281.75,
        "temp_min": 281.75,
        "temp_max": 281.75,
        "pressure": 1023,
        "sea_level": 1023,
        "grnd_level": 955,
        "humidity": 92,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.99, "deg": 70, "gust": 1.15 },
      "visibility": 10000,
      "pop": 0,
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-26 12:00:00"
    },
    {
      "dt": 1732633200,
      "main": {
        "temp": 280.9,
        "feels_like": 280.9,
        "temp_min": 280.9,
        "temp_max": 280.9,
        "pressure": 1024,
        "sea_level": 1024,
        "grnd_level": 955,
        "humidity": 96,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": { "all": 99 },
      "wind": { "speed": 1.29, "deg": 44, "gust": 1.38 },
      "visibility": 6416,
      "pop": 0.31,
      "rain": { "3h": 0.27 },
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-26 15:00:00"
    },
    {
      "dt": 1732644000,
      "main": {
        "temp": 280.6,
        "feels_like": 280.6,
        "temp_min": 280.6,
        "temp_max": 280.6,
        "pressure": 1024,
        "sea_level": 1024,
        "grnd_level": 955,
        "humidity": 97,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.77, "deg": 56, "gust": 0.87 },
      "visibility": 5716,
      "pop": 0.54,
      "rain": { "3h": 0.5 },
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-26 18:00:00"
    },
    {
      "dt": 1732654800,
      "main": {
        "temp": 280.52,
        "feels_like": 280.52,
        "temp_min": 280.52,
        "temp_max": 280.52,
        "pressure": 1025,
        "sea_level": 1025,
        "grnd_level": 956,
        "humidity": 98,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.82, "deg": 57, "gust": 1.02 },
      "visibility": 5898,
      "pop": 1,
      "rain": { "3h": 1.05 },
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-26 21:00:00"
    },
    {
      "dt": 1732665600,
      "main": {
        "temp": 280.42,
        "feels_like": 280.42,
        "temp_min": 280.42,
        "temp_max": 280.42,
        "pressure": 1024,
        "sea_level": 1024,
        "grnd_level": 955,
        "humidity": 99,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.73, "deg": 49, "gust": 0.85 },
      "visibility": 3120,
      "pop": 1,
      "rain": { "3h": 0.58 },
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-27 00:00:00"
    },
    {
      "dt": 1732676400,
      "main": {
        "temp": 280.21,
        "feels_like": 280.21,
        "temp_min": 280.21,
        "temp_max": 280.21,
        "pressure": 1024,
        "sea_level": 1024,
        "grnd_level": 955,
        "humidity": 99,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 1.05, "deg": 347, "gust": 1.15 },
      "visibility": 2594,
      "pop": 0.95,
      "rain": { "3h": 1.18 },
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-27 03:00:00"
    },
    {
      "dt": 1732687200,
      "main": {
        "temp": 280.33,
        "feels_like": 280.33,
        "temp_min": 280.33,
        "temp_max": 280.33,
        "pressure": 1024,
        "sea_level": 1024,
        "grnd_level": 955,
        "humidity": 98,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.82, "deg": 13, "gust": 0.89 },
      "visibility": 5681,
      "pop": 1,
      "rain": { "3h": 0.73 },
      "sys": { "pod": "n" },
      "dt_txt": "2024-11-27 06:00:00"
    },
    {
      "dt": 1732698000,
      "main": {
        "temp": 280.37,
        "feels_like": 280.37,
        "temp_min": 280.37,
        "temp_max": 280.37,
        "pressure": 1025,
        "sea_level": 1025,
        "grnd_level": 956,
        "humidity": 99,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": { "all": 100 },
      "wind": { "speed": 0.88, "deg": 10, "gust": 0.88 },
      "visibility": 4138,
      "pop": 1,
      "rain": { "3h": 1.86 },
      "sys": { "pod": "d" },
      "dt_txt": "2024-11-27 09:00:00"
    }
  ]


export default function useFetchWeatherForecast(setWeatherForecast, inputState, selectedMode, enabled) {
    if (inputState === undefined) return;
    useEffect(() => {(async () => {
        if (!enabled || !inputState) return []
        switch (selectedMode) {
            case "coords":
                try {
                    let res = await forecastWeatherDataManager.getData({lat: inputState.lat, lon: inputState.lon})

                    setWeatherForecast(res.data.list)
                } catch(error) {
                    console.error(error)
                    if (error instanceof CoordinatesError) {
                        alert("Looks like you provided wrong coordinates")
                    } else {
                        alert("Error while getting weather data")
                    }
                }
            break
            case "city":
                try {
                    let coords = await geodecodeDataManager.getData({cityName : inputState.city, countryCode : inputState.country})
                    let res = await forecastWeatherDataManager.getData({lat : coords.lat, lon : coords.lon})

                    setWeatherForecast(res.data.list)
                } catch(error) {
                    console.error(error)
                    if (error instanceof CityError) {
                        alert("Sorry, could not find the city you specified. Please, check the city name and country code, you've entered")
                    } else {
                        alert("Error while getting weather data")
                    }
                }
            break
        }
    })()}, [inputState, selectedMode, enabled])
}