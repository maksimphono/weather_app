import React, {createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, useTransition} from 'react'
import style from "../css/Home.module.scss"
import { InputState } from './InputFields.jsx'
import ForecastWeather from './ForecastWeather.jsx'
import OneDayWeather from './OneDayWeather.jsx'
import { FollowedCitiesOverlayMenu } from './OneDayWeather.jsx'

export const InputStateInterface = createContext()
export const OnSubmitContext = createContext()

export default function Home() {
    const [selectedMode, setSelectedMode] = useState("city") // "city" | "coordinates"
    const [inputState, setInputState] = useState()
    const [currentWeatherView, setCurrentWeatherView] = useState("today") // "today" | "forecast"
    const [overLayOpen, setOverLayOpen] = useState(false)
    const inputInterfaceRef = useRef()

    const handleSubmit = useCallback(async ({inputState, selectedMode}) => {
        console.log(`Submit`)
        console.dir(inputState)
        setInputState(inputState)
        setSelectedMode(selectedMode)
    }, [])

    useEffect(() => {
        // set default input state
        setInputState(new InputState("Moscow", "RU", 0, 0))
        if (inputInterfaceRef.current)
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
                    <FollowedCitiesOverlayMenu
                        onClose = {() => setOverLayOpen(false)}
                    />
                    :
                    <></>
                }

                {(currentWeatherView === "today")?
                    <OneDayWeather inputState = {inputState} selectedMode={selectedMode} />
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