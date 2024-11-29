import React, {useCallback, useEffect, useReducer, useRef, useState, useTransition} from 'react'
import style from "../css/Home.module.scss"
import InputFields from './InputFields.jsx'
import oneDayWeatherDataManager, { CoordinatesError } from '../DataManager/OneDayWeatherDataManager.js'
import geodecodeDataManager, {CityError} from '../DataManager/GeodecodeDataManager.js'
import ForecastWeather from './ForecastWeather.jsx'
import useGetOneDayWeatherData from '../hooks/useGetONeDayWeatherData.js'
import {initalInputState} from "./InputFields.jsx"
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
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

function OneDayWeather({inputState, selectedMode, onSubmit}) {
    const [weatherData, setWeatherData] = useState(currentWeatherData)
    const [followerCoords, setFollowerCoords] = useState({x: 0, y : 0})
    //const [inputState, setInputState] = useState({})
    const weatherViewRef = useRef(null)

    useEffect(() => {(async () => {
        
    })()}, [])

    const handleInputChange = useCallback(({inputState, selectedMode}) => {
    }, [])

    const handleLikeCity = useCallback(async () => {
        const adapter = await dataAdapterFactory.createUserFollowingListAdapter()
        let entry = null
        switch(selectedMode) {
            case "city":
                entry = {
                    coordinates : {lat : weatherData.coord.lat, lon : weatherData.coord.lon},
                    name : inputState.city,
                    country_code : weatherData.sys.country
                }
            break
            case "coords":
                entry = {
                    coordinates : {lat : inputState.lat, lon : inputState.lon},
                    name : weatherData.name || "Unknown",
                    country_code : weatherData.sys.country || ""
                }
            break
        }
        try {
            await adapter.save(entry)
        } catch(error) {
            alert("Error when adding city to the database")
        }
    }, [weatherData, selectedMode, inputState])

    useGetOneDayWeatherData(setWeatherData, inputState, selectedMode)

    return (
        <div className = {style["home"]}>
            {Object.keys(weatherData).length &&
            <div ref = {weatherViewRef} className = {style["weather__view"]}>
                <i style = {{top: followerCoords.y, left: followerCoords.x}} className = {style["follower"]}></i>
                <div className = {style["basic__info"]}>
                    <InputFields
                        onChange = {handleInputChange}
                        onSubmit = {onSubmit}
                        defaultState = {inputState}
                    />
                    <SmallWeatherData gridArea = "temp" value = {weatherData.main.temp}>Temperature</SmallWeatherData>
                    <SmallWeatherData gridArea = "feels_like" value = {weatherData.main.feels_like}>Feels like</SmallWeatherData>

                    <SmallWeatherData gridArea = "temp_min" value = {weatherData.main.temp_min}>Minimal temperature</SmallWeatherData>
                    <SmallWeatherData gridArea = "temp_max" value = {weatherData.main.temp_max}>Maximum temperature</SmallWeatherData>

                    <SmallWeatherData gridArea = "pressure" value = {weatherData.main.pressure}>Pressure</SmallWeatherData>
                    <SmallWeatherData gridArea = "humidity" value = {weatherData.main.humidity}>Humidity</SmallWeatherData>
                </div>
                <div className = {style["pretty__view"]}>
                    <div id = "logo"></div>
                    <button className = {style["like__button"]} onClick = {handleLikeCity}>O</button>
                    <SmallWeatherData gridArea = "main" className = {"weather__main"}>
                        <span>{weatherData.weather[0].main}</span>
                        <span>{weatherData.weather[0].description}</span>
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "name" className = {"location__name"}>
                        <span>
                            {
                                (weatherData.sys?.country && weatherData.name.length)?
                                    [weatherData.name, weatherData.sys.country].join(", ")
                                :
                                    "Unknown" // most likely means, that OpenWeather doesn't know about that city
                            }
                        </span>
                        <span>
                            ({
                                [weatherData.coord.lat, weatherData.coord.lon].join(", ")
                            })
                        </span>

                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "date" className = {"date"}>
                        {(new Date()).toLocaleString().replaceAll("/", ".").slice(0,10)}
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
                    <SmallWeatherData gridArea = "sea_level" className = {"sea_level"}>
                        <span>Sea level</span>
                        <span>{weatherData.main.sea_level}</span>
                    </SmallWeatherData>
                    <SmallWeatherData gridArea = "grnd_level" className = {"grnd_level"}>
                        <span>Ground level</span>
                        <span>{weatherData.main.grnd_level}</span>
                    </SmallWeatherData>
                </div>
            </div>
            }
        </div>
    )
}

export default function Home() {
    const [selectedMode, setSelectedMode] = useState("city") // "city" | "coordinates"
    const [inputState, setInputState] = useState(initalInputState)
    const [currentWeatherView, setCurrentWeatherView] = useState("today") // "today" | "forecast"

    const handleSubmit = useCallback(async ({inputState, selectedMode}) => {
        console.log(`Submit`)
        console.dir(inputState)
        setInputState(inputState)
        setSelectedMode(selectedMode)
    }, [])

    return (
        <>
            <label>
                <span>Today</span>
                <input type="radio" name = "View" checked = {currentWeatherView === "today"} value = {"today"} onChange={({target}) => setCurrentWeatherView(target.value)}/>
            </label>
            <label>
                <span>Forecast</span>
                <input type="radio" name = "View" checked = {currentWeatherView === "forecast"} value = {"forecast"} onChange={({target}) => setCurrentWeatherView(target.value)}/>
            </label>
            {(currentWeatherView === "today")?
                <OneDayWeather inputState = {inputState} selectedMode={selectedMode} onSubmit = {handleSubmit}/>
            :(currentWeatherView === "forecast")?
                <ForecastWeather inputState = {inputState} selectedMode={selectedMode} enabled={true}/>
            :
            <></>
            }
        </>
        
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