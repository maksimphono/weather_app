import React, {useEffect} from "react"
import forecastWeatherDataManager from "../DataManager/ForecastWeatherDataManager"
import geodecodeDataManager from "../DataManager/GeodecodeDataManager"
import { CityError } from "../DataManager/GeodecodeDataManager"
import { CoordinatesError } from "../DataManager/ForecastWeatherDataManager"

export default function useFetchWeatherForecast(setWeatherForecast, inputState, selectedMode, enabled) {
    if (inputState === undefined) return;
    useEffect(() => {(async () => {
        if (!enabled || !inputState) return []
        switch (selectedMode) {
            case "coords":
                try {
                    let res = await forecastWeatherDataManager.getData({lat: inputState.lat, lon: inputState.lon})

                    setWeatherForecast(res.data.list)
                } catch(error) {
                    console.error(error)
                    if (error instanceof CoordinatesError) {
                        alert("Looks like you provided wrong coordinates")
                    } else {
                        alert("Error while getting weather data")
                    }
                }
            break
            case "city":
                try {
                    let coords = await geodecodeDataManager.getData({cityName : inputState.city, countryCode : inputState.country})
                    let res = await forecastWeatherDataManager.getData({lat : coords.lat, lon : coords.lon})

                    setWeatherForecast(res.data.list)
                } catch(error) {
                    console.error(error)
                    if (error instanceof CityError) {
                        alert("Sorry, could not find the city you specified. Please, check the city name and country code, you've entered")
                    } else {
                        alert("Error while getting weather data")
                    }
                }
            break
        }
    })()}, [inputState, selectedMode, enabled])
}