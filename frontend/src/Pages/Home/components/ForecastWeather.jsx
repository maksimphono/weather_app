import React, {useState, useRef} from "react"
import PropTypes from 'prop-types'
import style from "../css/Forecast.module.scss"
import useFetchWeatherForecast from "../hooks/useFetchWeatherForecast"
import useToggle from "../hooks/useToggle"
import {CELSIUS_TEMP_UNIT} from "../hooks/useForecastTempAutoConvert"

function DayWeather({weatherData, className}) {
    const classNames = (className !== undefined)?className.split(" "):[]

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

// Add PropTypes validation for DayWeather component
DayWeather.propTypes = {
    weatherData: PropTypes.shape({
        weather: PropTypes.arrayOf(PropTypes.shape({
            main: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired
        })).isRequired,
        dt_txt: PropTypes.string.isRequired,
        main: PropTypes.shape({
            temp: PropTypes.number.isRequired,
            feels_like: PropTypes.number.isRequired,
            temp_min: PropTypes.number.isRequired,
            temp_max: PropTypes.number.isRequired,
            sea_level: PropTypes.number.isRequired,
            grnd_level: PropTypes.number.isRequired
        }).isRequired,
        visibility: PropTypes.number.isRequired
    }),
    className: PropTypes.string
}

/* TODO : complete and include later
function TemperatureUnitsSwitch({value, tempUnits, setTempUnits}) {
    return (
        <label>
            <i className = {style["icon"]} />
            <input type = "radio" name="tempmode" value = {value} checked = {tempUnits === value} onChange={({target}) => setTempUnits(target.value)} />
        </label>
    )
}
*/

function ForecastWeather({inputState, selectedMode, enabled}) {
    const weatherViewRef = useRef()
    const [tempUnits, setTempUnits] = useState(CELSIUS_TEMP_UNIT)
    const [weatherForecast, setWeatherForecast] = useState([])
    const [timeMode, toggleTimeMode] = useToggle(["Day", "Night"])

    useFetchWeatherForecast(setWeatherForecast, inputState, selectedMode, enabled)

    //useTempAutoConvert(weatherForecast, setWeatherForecast, tempUnits)

    return (
        <>
        {weatherForecast && Object.keys(weatherForecast).length &&
            <div ref = {weatherViewRef} className = {style["weather__view"]}>
                {weatherForecast.map(weatherData => (
                    <DayWeather weatherData={weatherData} key = {weatherData.dt} />
                ))}
            </div>
        }
        </>
    )
}

ForecastWeather.propTypes = {
    inputState: PropTypes.shape({
        lat: PropTypes.number,
        lon: PropTypes.number,
        city: PropTypes.string,
        country: PropTypes.string
    }),
    selectedMode: PropTypes.oneOf(['coords', 'city']).isRequired,
    enabled: PropTypes.bool.isRequired
}

export default ForecastWeather
/* TODO : complete and include later
<div className = {style["control__buttons"]}>
                <TemperatureUnitsSwitch value = {CELSIUS_TEMP_UNIT} tempUnits={tempUnits} setTempUnits={setTempUnits}/>
                <TemperatureUnitsSwitch value = {FAHRENHEIT_TEMP_UNIT} tempUnits={tempUnits} setTempUnits={setTempUnits}/>
                <TemperatureUnitsSwitch value = {KELVIN_TEMP_UNIT} tempUnits={tempUnits} setTempUnits={setTempUnits}/>
            </div>
*/