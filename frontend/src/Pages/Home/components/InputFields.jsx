import React, {useReducer, useState, useCallback} from "react"
import style from "../css/Home.module.scss"


class InputState {
    constructor(city, lat, lon) {
        this._city = city
        this._lat = lat
        this._lon = lon
    }
    deepcopy() {
        const copy = new InputState(this._city, this._lat, this._lon)
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
    setCity(city) {
        this._city = city
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

function inputReducer(state, action) {
    switch(action.type) {
        case "city":
            return state.deepcopy().setCity(action.city)
        case "lat":
            return state.deepcopy().setLat(action.lat)
        case "lon":
            return state.deepcopy().setLon(action.lon)
        default:
            return state
    }
}

const initalInputState = new InputState("Moscow", 0, 0)

const cityAction = (val) => ({type : "city", city : val})
const latAction = (val) => ({type : "lat", lat : val})
const lonAction = (val) => ({type : "lon", lon : val})

export default function InputFields() {
    const [seletcedMode, setSelectedMode] = useState("city")
    const [inputState, dispatch] = useReducer(inputReducer, initalInputState)

    const handleSubmit = useCallback((event) => {
        event.preventDefault()
    }, [])

    return (
        <form onSubmit = {handleSubmit} className={style["input__fields"]} style = {{"gridArea" : "input_fields", backgroundColor: "blue"}}>
            <div className = {style["input__switch"]}>
                <label>
                    <input type = "radio" name = "input_mode" defaultChecked = {true} value = "city" onChange={({target}) => setSelectedMode(target.value)} />
                    <span 
                        style = {seletcedMode === "city"?
                            {"color" : "var(--color-light)"}:
                            {"color" : "var(--color-dark)"}}
                    >
                        City
                    </span>
                </label>
                <label>
                    <input type = "radio" name = "input_mode" value = "coords" onChange={({target}) => setSelectedMode(target.value)}/>
                    <span 
                        style = {seletcedMode === "coords"?
                            {"color" : "var(--color-light)"}:
                            {"color" : "var(--color-dark)"}}
                    >
                        Coordinates
                    </span>
                </label>
            </div>
            {(seletcedMode === "city") ? 
                <label>
                    <button type = "submit" name = "Search">Search</button>
                    <input data-testid = "cityinput" type="text" name = "city" value = {inputState.city} onChange = {({target}) => dispatch(cityAction(target.value))} />
                </label>
            : (seletcedMode === "coords") ?
                <label>
                    <input data-testid = "latinput"
                        type="number" 
                        name = "lat" 
                        value = {inputState.lat} 
                        onChange = {({target}) => dispatch(latAction(target.value))}
                    />
                    <input data-testid = "loninput"
                        type="number" 
                        name = "lon" 
                        value = {inputState.lon} 
                        onChange = {({target}) => dispatch(lonAction(target.value))}
                    />
                    <button type = "submit">Search</button>
                </label>
            :
                <></>
            }
        </form>
    )
}