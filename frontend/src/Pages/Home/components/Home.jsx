import React, {useCallback, useEffect, useReducer, useState} from 'react'
import style from "../css/Home.module.scss"
import InputFields from './InputFields.jsx'
//const style = {}

function SmallWeatherData({gridArea, value, className, children}) {
    const classNames = className !== undefined?className.split(" "):[]

    return (
        <div className = {[style["smallWeatherData"], ...classNames.map(n => style[n])].join(" ")} style = {{"gridArea": gridArea}}>
            {children}
            {value !== undefined ? 
                <span className = {style["value"]}>{value}</span>
            :
                <></>
            }
        </div>
    )
}

const currentWeatherData = {
    "coord": { "lon": -94.04, "lat": 33.44 },
    "weather": [
      { "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }
    ],
    "base": "stations",
    "main": {
      "temp": 279.19,
      "feels_like": 277.67,
      "temp_min": 278.76,
      "temp_max": 279.19,
      "pressure": 1024,
      "humidity": 61,
      "sea_level": 1024,
      "grnd_level": 1012
    },
    "visibility": 10000,
    "wind": { "speed": 2.06, "deg": 300 },
    "clouds": { "all": 0 },
    "dt": 1732282294,
    "sys": {
      "type": 1,
      "id": 6094,
      "country": "US",
      "sunrise": 1732280085,
      "sunset": 1732317031
    },
    "timezone": -21600,
    "id": 4133367,
    "name": "Texarkana",
    "cod": 200
  }
  

export default function Home() {
    const [weatherData, setWeatherData] = useState(currentWeatherData)

    return (
        <div className = {style["home"]}>
            <div className = {style["weather__view"]}>
                <div className = {style["basic__info"]}>
                    <InputFields />
                    <SmallWeatherData gridArea = "temp" value = {weatherData.main.temp}>Temperature</SmallWeatherData>
                    <SmallWeatherData gridArea = "feels_like" value = {weatherData.main.feels_like}>Feels like</SmallWeatherData>

                    <SmallWeatherData gridArea = "temp_min" value = {weatherData.main.temp_min}>Minimal temperature</SmallWeatherData>
                    <SmallWeatherData gridArea = "temp_max" value = {weatherData.main.temp_max}>Maximum temperature</SmallWeatherData>

                    <SmallWeatherData gridArea = "pressure" value = {weatherData.main.pressure}>Pressure</SmallWeatherData>
                    <SmallWeatherData gridArea = "humidity" value = {weatherData.main.humidity}>Humidity</SmallWeatherData>
                </div>
                <div className = {style["pretty__view"]}>
                    <div id = "logo"></div>
                    <SmallWeatherData gridArea = "main" className = {"weather__main"}>
                        <span>{weatherData.weather[0].main}</span>
                        <span>{weatherData.weather[0].description}</span>
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "name" className = {"location__name"}>
                        {weatherData.name}, {weatherData.sys.country}
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "date" className = {"date"}>
                        {(new Date()).toISOString()}
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "timezone" className = {"timezone"}>
                        <span>Timezone</span>
                        <span>{weatherData.timezone}</span>
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "wind" className = {"wind__data"}>
                        <span>Wind</span>
                        <span>{weatherData.wind.speed} m/s</span>
                        <span>{weatherData.wind.deg} deg</span>
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "visibility" className = {"visibility__data"}>
                        <span>Visibility</span>
                        <span>{weatherData.visibility}</span>
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "sea_level" className = {"sunrise"}>
                        <span>Sea level</span>
                        <span>{weatherData.main.sea_level}</span>
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "grnd_level" className = {"sunset"}>
                        <span>Ground level</span>
                        <span>{weatherData.main.grnd_level}</span>
                    </SmallWeatherData>
                </div>
            </div>
        </div>
    )
}
/*
"visibility": 10000,
         "wind": {
            "speed": 4.09,
            "deg": 121,
            "gust": 3.47
         },
         "rain": {
            "1h": 2.73
         },
         "clouds": {
            "all": 83
         },
         "dt": 1726660758,
         "sys": {
            "type": 1,
            "id": 6736,
            "country": "IT",
            "sunrise": 1726636384,
            "sunset": 1726680975
         },
         "timezone": 7200,
         "id": 3165523,
         "name": "Province of Turin",
*/