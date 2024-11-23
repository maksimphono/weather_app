import React, {useEffect} from "react"

export const CELSIUS_TEMP_UNIT = "Celsius"
export const FAHRENHEIT_TEMP_UNIT = "Fahrenheit"
export const KELVIN_TEMP_UNIT = "Kelvin"

function convertTemperature(kelvin, mode) {
    switch (mode) {
        case CELSIUS_TEMP_UNIT:
            return Math.round((kelvin - 273.15) * 100) / 100
        case FAHRENHEIT_TEMP_UNIT:
            return Math.round(((kelvin - 273.15) * 9/5 + 32) * 100) / 100
        default:
            return kelvin
    }
}

export default function useTempAutoConvert(setWeatherForecast, tempUnits) {
    useEffect(() => {
        setWeatherForecast(data => {
            console.log(Object.keys(data).length)
            if (Object.keys(data).length === 0) return data

            return data.map(dayForecast => ({
                    ...dayForecast,
                    main : {
                        ...dayForecast.main,
                        temp : convertTemperature(dayForecast.init_main.temp, tempUnits),
                        feels_like : convertTemperature(dayForecast.init_main.feels_like, tempUnits),
                        temp_min : convertTemperature(dayForecast.init_main.temp_min, tempUnits),
                        temp_max : convertTemperature(dayForecast.init_main.temp_max, tempUnits),
                    }
                })
            )
        })
    }, [tempUnits])
}