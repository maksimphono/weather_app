import React, {useEffect} from "react"
import oneDayWeatherDataManager from "../DataManager/OneDayWeatherDataManager.js"
import { CoordinatesError } from "../DataManager/OneDayWeatherDataManager.js"
import geodecodeDataManager, { CityError } from "../DataManager/GeodecodeDataManager.js"
//import { unchangedTextChangeRange } from "typescript"

export default function useGetOneDayWeatherData(setWeatherData, inputState, selectedMode) {
    useEffect(() => {(async () => {
        if (inputState === undefined) return;
        console.log(`GetOneDayWeatherData`)

        switch (selectedMode) {
            case "coords":
                if (inputState?.lat === undefined || inputState?.lon === undefined) return;
                try {
                    let res = await oneDayWeatherDataManager.getData({lat: inputState.lat, lon: inputState.lon})

                    setWeatherData(res.data)
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
                console.dir(inputState)
                if (inputState?.city?.length === 0) return;
                try {
                    let coords = await geodecodeDataManager.getData({cityName : inputState.city, countryCode : inputState.country})
                    let res = await oneDayWeatherDataManager.getData({lat : coords.lat, lon : coords.lon})

                    if (res.data.name.length && inputState.city) {
                        res.data.name = inputState.city
                    }
                    setWeatherData(res.data)
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
    })()}, [inputState, selectedMode])
}