import React, {useCallback, useReducer, useState} from 'react'
import style from "../css/Home.module.scss"
import InputFields from './InputFields.jsx'
//const style = {}

function SmallWeatherData({gridArea, value, children}) {
    return (
        <div className = {style["smallWeatherData"]} style = {{"gridArea": gridArea}}>
            <span className = {style["text"]}>{children}</span>
            <span className = {style["value"]}>{value}</span>
        </div>
    )
}

export default function Home() {

    console.log(style)
    return (
        <div className = {style["home"]}>
            <div className = {style["weather__view"]}>
                <div className = {style["basic__info"]}>
                    <InputFields />
                    <SmallWeatherData gridArea = "temp" value = {"22"}>Temperature</SmallWeatherData>
                    <SmallWeatherData gridArea = "feels_like" value = {"28"}>Feels like</SmallWeatherData>

                    <SmallWeatherData gridArea = "temp_min" value = {"22"}>Minimal temperature</SmallWeatherData>
                    <SmallWeatherData gridArea = "temp_max" value = {"22"}>Maximum temperature</SmallWeatherData>

                    <SmallWeatherData gridArea = "pressure" value = {"22"}>Pressure</SmallWeatherData>
                    <SmallWeatherData gridArea = "humidity" value = {"22"}>Humidity</SmallWeatherData>

                    <SmallWeatherData gridArea = "sea_level" value = {"22"}>Sea level</SmallWeatherData>
                    <SmallWeatherData gridArea = "grnd_level" value = {"22"}>Grnd level</SmallWeatherData>
                    
                    <SmallWeatherData gridArea = "sinrise" value = {"22"}>Sinrise</SmallWeatherData>
                    <SmallWeatherData gridArea = "sunset" value = {"22"}>Sunset</SmallWeatherData>
                </div>
                <div className = {style["pretty__view"]}>

                </div>
            </div>
        </div>
    )
}
