import React, {Fragment, useEffect} from "react"
import convertTemperature, {CELSIUS_TEMP_UNIT as CS, FAHRENHEIT_TEMP_UNIT as FH, KELVIN_TEMP_UNIT as KL} from "../utils/convertTemperature"

export const KELVIN_TEMP_UNIT = KL
export const CELSIUS_TEMP_UNIT = CS
export const FAHRENHEIT_TEMP_UNIT = FH

export default function useTempAutoConvert(weatherForecast, setWeatherForecast, tempUnits) {
    useEffect(() => {
        if (!weatherForecast.length) return;
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
    }, [weatherForecast, tempUnits])
}