import React, {useState} from 'react'
import style from "../css/Home.module.scss"

function SmallWeatherData({gridArea, value, children}) {
    return (
        <div className = {style["smallWeatherData"]} style = {{"gridArea": gridArea, backgroundColor: "red"}}>
            <span className = {style["text"]}>{children}</span>
            <span className = {style["value"]}>{value}</span>
        </div>
    )
}

function InputFields() {
    const [seletcedMode, setSelectedMode] = useState("city")

    return (
        <form className={style["input__fields"]} style = {{"gridArea" : "input_fields", backgroundColor: "blue"}}>
            <div className = {style["input__switch"]}>
                <label style = {seletcedMode === "city"?{"color" : "#fff"}:{"color" : "#222"}}>
                    <input type = "radio" name = "input_mode" defaultChecked = {true} value = "city" onChange={({target}) => setSelectedMode(target.value)} />
                    <span>City</span>
                </label>
                <label style = {seletcedMode === "coords"?{"color" : "#fff"}:{"color" : "#222"}}>
                    <input type = "radio" name = "input_mode" value = "coords" onChange={({target}) => setSelectedMode(target.value)}/>
                    <span>Coordinates</span>
                </label>
            </div>
            <label htmlFor="">
                <input type="text" />
            </label>
        </form>
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
