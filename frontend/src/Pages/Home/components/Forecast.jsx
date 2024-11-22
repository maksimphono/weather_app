import React, {useState, useRef} from "react"
import style from "../css/Forecast.module.scss"

export default function Forecast() {
    const weatherViewRef = useRef()

    return (
        <div className = {style["home"]}>
            <div ref = {weatherViewRef} className = {style["weather__view"]}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}