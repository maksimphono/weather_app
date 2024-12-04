import React, {useReducer, useState, useCallback, useEffect, useImperativeHandle, useContext} from "react"
import style from "../css/OneDay.module.scss"
import { InputStateInterface, OnSubmitContext } from "./Home"

export class InputState {
    constructor(city, country, lat, lon) {
        this._country = country
        this._city = city
        this._lat = lat
        this._lon = lon
    }
    deepcopy() {
        const copy = new InputState(this._city, this._country, this._lat, this._lon)
        return copy
    }
    get city() {
        return this._city
    }
    get lat() {
        return this._lat
    }
    get lon() {
        return this._lon
    }
    get country() {
        return this._country
    }
    setCity(city) {
        this._city = city
        return this
    }
    setCountry(country) {
        this._country = country
        return this
    }
    setLat(val) {
        this._lat = val
        return this
    }
    setLon(val) {
        this._lon = val
        return this
    }
}

const initalInputState = new InputState("Moscow", "RU", 0, 0)

function inputReducer(state, action) {
    switch(action.type) {
        case "country":
            return state.deepcopy().setCountry(action.country)
        case "city":
            return state.deepcopy().setCity(action.city)
        case "lat":
            return state.deepcopy().setLat(action.lat)
        case "lon":
            return state.deepcopy().setLon(action.lon)
        case "setAll":
            return state.deepcopy()
                .setLon(action.lon)
                .setLat(action.lat)
                .setCity(action.city)
                .setCountry(action.country)
        default:
            return state
    }
}

const countryAction = (val) => ({type : "country", country : val})
const cityAction = (val) => ({type : "city", city : val})
const latAction = (val) => ({type : "lat", lat : val})
const lonAction = (val) => ({type : "lon", lon : val})
const setAllAction = (state) => ({type : "setAll", lon : state.lon, lat : state.lat, country : state.country, city : state.city})

export default function InputFields() {
    const {inputInterfaceRef, masterState} = useContext(InputStateInterface)
    const onSubmit = useContext(OnSubmitContext)
    const [selectedMode, setSelectedMode] = useState("city")
    const [inputState, dispatch] = useReducer(inputReducer, initalInputState, () => initalInputState)

    useImperativeHandle(inputInterfaceRef, () => ({
        setInputState : (state) => {
            dispatch(setAllAction(state))
        }
    }), [dispatch])

    useEffect(() => {
        if (masterState)
            dispatch(setAllAction(masterState))
        else
            dispatch(setAllAction(initalInputState))
    }, [])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        console.dir(inputState)
        await onSubmit({inputState, selectedMode})
    }, [inputState, selectedMode])

    useEffect(() => {
        console.info("Renew inputState")
        console.dir(inputState)
    }, [inputState])

    const handleCountryChange = useCallback(({target}) => {
        dispatch(countryAction(target.value))
    }, [dispatch])

    const handleCityChange = useCallback(({target}) => {
        dispatch(cityAction(target.value))
    }, [dispatch])

    const handleLatChange = useCallback(({target}) => {
        dispatch(latAction(target.value))
    }, [dispatch])
    
    const handleLonChange = useCallback(({target}) => {
        dispatch(lonAction(target.value))
    }, [dispatch])

    return (
        <form onSubmit = {handleSubmit} className={style["input__fields"]} style = {{"gridArea" : "input_fields"}}>
            <div className = {style["input__switch"]}>
                <label>
                    <input type = "radio" name = "input_mode" defaultChecked = {true} value = "city" onChange={({target}) => setSelectedMode(target.value)} />
                    <span 
                        style = {selectedMode === "city"?
                            {"color" : "var(--color-light)"}:
                            {"color" : "var(--color-dark)"}}
                    >
                        City
                    </span>
                </label>
                <label>
                    <input type = "radio" name = "input_mode" value = "coords" onChange={({target}) => setSelectedMode(target.value)}/>
                    <span 
                        style = {selectedMode === "coords"?
                            {"color" : "var(--color-light)"}:
                            {"color" : "var(--color-dark)"}}
                    >
                        Coordinates
                    </span>
                </label>
            </div>
            {(selectedMode === "city") ? 
                <label>
                    <button type = "submit" name = "Search">Search</button>
                    <input 
                        data-testid = "cityinput" 
                        type="text" 
                        name = "city" 
                        value = {inputState.city} 
                        onChange = {handleCityChange} />
                    <input 
                        type="text" 
                        value = {inputState.country} 
                        onChange = {handleCountryChange}
                    />
                </label>
            : (selectedMode === "coords") ?
                <label>
                    <input data-testid = "latinput"
                        type="number" 
                        name = "lat" 
                        value = {inputState.lat} 
                        onChange = {handleLatChange}
                    />
                    <input data-testid = "loninput"
                        type="number" 
                        name = "lon" 
                        value = {inputState.lon} 
                        onChange = {handleLonChange}
                    />
                    <button type = "submit">Search</button>
                </label>
            :
                <></>
            }
        </form>
    )
}