import React, {createContext, useCallback, useEffect, useReducer, useRef, useState, useTransition} from 'react'
import style from "../css/Home.module.scss"
import InputFields, { InputState } from './InputFields.jsx'
import oneDayWeatherDataManager, { CoordinatesError } from '../DataManager/OneDayWeatherDataManager.js'
import geodecodeDataManager, {CityError} from '../DataManager/GeodecodeDataManager.js'
import ForecastWeather from './ForecastWeather.jsx'
import useGetOneDayWeatherData from '../hooks/useGetONeDayWeatherData.js'
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

function OverLayMenu({items, onClose, onRemove, onSelect}) {
    const [selectedItemIndex, setSelectedItemIndex] = useState(0)

    const handleChange = useCallback((event) => {
        event.preventDefault()
        setSelectedItemIndex(event.target.value)
        onSelect(items[event.target.value])
    }, [])

    useEffect(() => {
        console.dir(items)
        if (items.length)
            setSelectedItemIndex(0)
    }, [items])

    return (
        <div className = {style["overlaymenu"]}>
            <button onClick = {(e) => {e.preventDefault(); onClose();}}>X</button>
            <ul value = {selectedItemIndex}>
                {items.map((item, index) => {
                    if (item !== undefined)
                        return (
                            <li 
                                onClick={e => {e.preventDefault(); onSelect(item);}}
                                key = {item.coordinates}
                            >
                                <span>{item.name}</span>
                                <span>{item.country_code}</span>
                                <span>{item.coordinates}</span>
                                <button onClick = {(e) => {e.preventDefault(); e.stopPropagation(); onRemove(item.coordinates);}}>X</button>
                            </li>
                        ) 
                })
                }
            </ul>
        </div>
    )
}

export const InputStateInterface = createContext()
export const OnSubmitContext = createContext()

function OneDayWeather({inputState, selectedMode, fetchFollowedCities}) {
    const [weatherData, setWeatherData] = useState(currentWeatherData)
    const [followerCoords, setFollowerCoords] = useState({x: 0, y : 0})
    const weatherViewRef = useRef(null)

    const handleFollowCity = useCallback(async () => {
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
            fetchFollowedCities()
            //entry.coordinates = `[${entry.coordinates.lat},${entry.coordinates.lon}]`
            //setFollowedCities(cities => [...cities, entry])
        } catch(error) {
            alert("Error when adding city to the database")
        }
    }, [weatherData, selectedMode, inputState])

    useGetOneDayWeatherData(setWeatherData, inputState, selectedMode)

    return (
        <>
        {Object.keys(weatherData).length &&
            <div ref = {weatherViewRef} className = {style["weather__view"]}>
                <i style = {{top: followerCoords.y, left: followerCoords.x}} className = {style["follower"]}></i>
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
                    <button className = {style["like__button"]} onClick = {handleFollowCity}>Follow</button>
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
        </>
    )
}




export default function Home() {
    const [selectedMode, setSelectedMode] = useState("city") // "city" | "coordinates"
    const [inputState, setInputState] = useState()
    const [currentWeatherView, setCurrentWeatherView] = useState("today") // "today" | "forecast"
    const [overLayOpen, setOverLayOpen] = useState(false)
    const [followedCities, setFollowedCities] = useState([])
    const [fetchEnabled, setFetchEnabled] = useState(false)
    const inputInterfaceRef = useRef()

    useEffect(() => {
        fetchFollowedCities()
    }, [])

    const fetchFollowedCities = useCallback(async () => {
        const adapter = await dataAdapterFactory.createUserFollowingListAdapter();

        try {
            const cities = await adapter.loadAll();
            setFollowedCities(cities);
        } catch (error) {
            alert('Error when fetching followed cities');
        }
    }, [])

    const handleItemSelect = useCallback((item) => {
        console.log(`Select ${item.name}`)
        let state = {}
        let [lat, lon] = JSON.parse(item.coordinates)
        if (item.name !== "Unknown") {
            state = new InputState(item.name, item.country_code, lat, lon)
        } else {
            state = new InputState("", "", lat, lon)
        }

        //setFetchEnabled(false)
        inputInterfaceRef.current.setInputState(state)
        setOverLayOpen(false)
    }, [])

    useEffect(() => {
        setFetchEnabled(true)
    }, [inputState])

    const handleRemoveFollowedCity = useCallback(async (coordinates) => {
        const adapter = await dataAdapterFactory.createUserFollowingListAdapter();

        try {
            await adapter.remove(coordinates)
            setFollowedCities(await adapter.loadAll())
        } catch(error) {
            alert("Error while removing item")
        }
    }, [])

    const handleSubmit = useCallback(async ({inputState, selectedMode}) => {
        console.log(`Submit`)
        console.dir(inputState)
        setInputState(inputState)
        setSelectedMode(selectedMode)
    }, [])

    useEffect(() => {
        inputInterfaceRef.current.setInputState(new InputState("Moscow", "RU", 0, 0))
    }, [])

    return (
        <InputStateInterface.Provider 
            value = {inputInterfaceRef}
        >
        <OnSubmitContext.Provider
            value = {handleSubmit}
        >
            <div className = {style["home"]}>
                <label>
                    <span>Today</span>
                    <input type="radio" name = "View" checked = {currentWeatherView === "today"} value = {"today"} onChange={({target}) => setCurrentWeatherView(target.value)}/>
                </label>
                <label>
                    <span>Forecast</span>
                    <input type="radio" name = "View" checked = {currentWeatherView === "forecast"} value = {"forecast"} onChange={({target}) => setCurrentWeatherView(target.value)}/>
                </label>

                <button type = "button" onClick = {(event) => {event.preventDefault(); setOverLayOpen(true);}}>Followed cities</button>
                {overLayOpen?
                    <OverLayMenu
                        items = {followedCities}
                        onSelect = {handleItemSelect}
                        onClose = {() => setOverLayOpen(false)}
                        onRemove = {handleRemoveFollowedCity}
                    />
                    :
                    <></>
                }

                {(currentWeatherView === "today")?
                    <OneDayWeather inputState = {inputState} selectedMode={selectedMode} fetchFollowedCities = {fetchFollowedCities} fetchEnabled = {fetchEnabled}/>
                :(currentWeatherView === "forecast")?
                    <ForecastWeather inputState = {inputState} selectedMode={selectedMode} enabled = {true}/>
                :
                <></>
                }
            </div>
        </OnSubmitContext.Provider>
        </InputStateInterface.Provider>
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