import React, {createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, useTransition} from 'react'
import style from "../css/Home.module.scss"
import InputFields, { InputState } from './InputFields.jsx'
import useGetOneDayWeatherData from '../hooks/useGetONeDayWeatherData.js'
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import { InputStateInterface } from './Home.jsx'

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

export function OverLayMenu({items, onClose, onRemove, onSelect}) {
    return (
        <div className = {style["overlaymenu"]}>
            <button onClick = {(e) => {e.preventDefault(); onClose();}}>X</button>
            <ul>
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

export default function OneDayWeather({inputState, selectedMode, fetchFollowedCities}) {
    const [weatherData, setWeatherData] = useState()
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
        } catch(error) {
            alert("Error when adding city to the database")
        }
    }, [weatherData, selectedMode, inputState])

    console.table(inputState)
    useGetOneDayWeatherData(setWeatherData, inputState, selectedMode)

    if (inputState === undefined) return <></>
    return (
        <>
        {weatherData && Object.keys(weatherData).length &&
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

export function FollowedCitiesOverlayMenu({onClose}) {
    const [followedCities, setFollowedCities] = useState([])
    const inputInterfaceRef = useContext(InputStateInterface)

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

        inputInterfaceRef.current.setInputState(state)
        onClose()
    }, [])

    const handleRemoveFollowedCity = useCallback(async (coordinates) => {
        const adapter = await dataAdapterFactory.createUserFollowingListAdapter();

        try {
            await adapter.remove(coordinates)
            setFollowedCities(await adapter.loadAll())
        } catch(error) {
            alert("Error while removing item")
        }
    }, [])

    return (
        <div className = {style["overlaymenu"]}>
            <button onClick = {(e) => {e.preventDefault(); onClose();}}>X</button>
            <ul>
                {followedCities.map((item, index) => {
                    if (item !== undefined)
                        return (
                            <li 
                                onClick={e => {e.preventDefault(); handleItemSelect(item);}}
                                key = {item.coordinates}
                            >
                                <span>{item.name}</span>
                                <span>{item.country_code}</span>
                                <span>{item.coordinates}</span>
                                <button onClick = {(e) => {e.preventDefault(); e.stopPropagation(); handleRemoveFollowedCity(item.coordinates);}}>X</button>
                            </li>
                        ) 
                })
                }
            </ul>
        </div>
    )
}