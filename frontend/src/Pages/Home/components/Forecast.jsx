import React, {useState, useRef, useCallback, useEffect} from "react"
import style from "../css/Forecast.module.scss"
import useFetchWeatherForecast from "../hooks/useFetchWeatherForecast"

/*
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
    }
*/


function DayWeather({weatherData, className, children}) {
    const classNames = (className !== undefined)?className.split(" "):[]

    console.dir(weatherData)
    if (!weatherData) return <></>
    return(
        <div className = {[style["dayWeather"], ...classNames.map(n => style[n])].join(" ")}>
            <div className = {style["main"]}>
                <span>{weatherData.weather[0].main}</span>
                <span>{weatherData.weather[0].description}</span>
            </div>
            <div className = {style["date"]}>
                <span className = {style["value"]}>{weatherData.dt_txt.slice(0, 10)}</span>
            </div>
            <div className = {style["temp"]}>
                <span>Temperature</span>
                <span className = {style["value"]}>{weatherData.main.temp}</span>
            </div>
            <div className = {style["feels_like"]}>
                <span>Feels like</span>
                <span className = {style["value"]}>{weatherData.main.feels_like}</span>
            </div>
            <div className = {style["temp_min"]}>
                <span>Minimal temperature</span>
                <span className = {style["value"]}>{weatherData.main.temp_min}</span>
            </div>
            <div className = {style["temp_max"]}>
                <span>Maximum temperature</span>
                <span className = {style["value"]}>{weatherData.main.temp_max}</span>
            </div>
            <div className = {style["visibility"]}>
                <span>Visibility</span>
                <span className = {style["value"]}>{weatherData.visibility}</span>
            </div>
            <div className = {style["sea_level"]}>
                <span>Sea level</span>
                <span className = {style["value"]}>{weatherData.main.sea_level}</span>
            </div>
            <div className = {style["grnd_level"]}>
                <span>Ground level</span>
                <span className = {style["value"]}>{weatherData.main.grnd_level}</span>
            </div>
        </div>
    )
}

function useToggle(items) {
    const [state, setState] = useState(items[0])

    const toggle = useCallback(() => {
        const index = state === items[0]? 1 : 0
        setState(items[index])
    }, [items])

    return [state, toggle]
}


const CELSIUS_TEMP_UNIT = Symbol("Celsius")
const FAHRENHEIT_TEMP_UNIT = Symbol("Fahrenheit")
const KELVIN_TEMP_UNIT = Symbol("Kelvin")

function convertTemperature(kelvin, mode) {
    switch (mode) {
        case CELSIUS_TEMP_UNIT:
            return Math.round((kelvin - 273.15) * 100) / 100
        case FAHRENHEIT_TEMP_UNIT:
            return Math.round(((kelvin - 273.15) * 9/5 + 32)*100) / 100
        default:
            return Math.round(kelvin * 100) / 100
    }
}

function useTempAutoConvert(setWeatherForecast, tempUnits) {
    useEffect(() => {
        setWeatherForecast(val => {
            console.log(Object.keys(val).length)
            if (Object.keys(val).length === 0) return val
            const copy = structuredClone(val)

            return copy.map(dayForecast => {
                return {
                    ...dayForecast,
                    main : {
                        ...(dayForecast.main),
                        temp : convertTemperature(dayForecast.main.temp, tempUnits),
                        feels_like : convertTemperature(dayForecast.main.feels_like, tempUnits),
                        temp_min : convertTemperature(dayForecast.main.temp_min, tempUnits),
                        temp_max : convertTemperature(dayForecast.main.temp_max, tempUnits),
                    }
                }
            })
        })
    }, [tempUnits])
}


export default function Forecast() {
    const weatherViewRef = useRef()
    const [tempUnits, setTempUnits] = useState(CELSIUS_TEMP_UNIT)
    const [weatherForecast, setWeatherForecast] = useState([])
    const [timeMode, toggleTimeMode] = useToggle(["Day", "Night"])
    const fetchWeather = useFetchWeatherForecast()

    useEffect(() => {
        const data = fetchWeather()
        setWeatherForecast(data)
    }, [])

    useTempAutoConvert(setWeatherForecast, tempUnits)

    return (
        <div className = {style["home"]}>
            <div ref = {weatherViewRef} className = {style["weather__view"]}>
            <div className = {style["control__buttons"]}>
                <input type = "radio" name="tempmode" />
                <input type = "radio" name="tempmode" />
                <input type = "radio" name="tempmode" />
            </div>
                {weatherForecast.map(weatherData => (
                    <DayWeather weatherData={weatherData} key = {weatherData.dt} />
                ))}
            </div>
        </div>
    )
}