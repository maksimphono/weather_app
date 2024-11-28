import DataManager, { FetchError } from "./DataManager.js"
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import { approximateCoordinates } from "./OneDayWeatherDataManager.js"
import Debugger from "../../utils/Debugger"
export const ForecastWeatherDataManager_class_Debugger = new Debugger("ForecastWeatherDataManager_class_Debugger")

const WEATHER_DATA_EXPIRATION_TIME_HOURS = 3


export class CoordinatesError extends Error {
    constructor(body) {
        super("Coordinates Error")
        this.body = body
    }
}


export function extractEveryDayData(list) {
    // list[0] is the data for current day, closest time
    if (list.length !== 40) 
        // most likely the Open Weather API returned incorrect list for some reason
        return null
    //const anchorTime = adjust3hIntervalAfterAnchorTime().slice(-8, -6)
    const everyDayWeather = list.filter(day => day.dt_txt.slice(-8, -6) === "12")
    const currentTimeWeather = list[0]

    if (parseInt(currentTimeWeather.dt_txt.slice(-8, -6)) <= 12) {
        return [currentTimeWeather, ...everyDayWeather.slice(-4)]
    } else {
        return [currentTimeWeather, ...everyDayWeather.slice(0, 4)]
    }
}

class ForecastWeatherDataManager extends DataManager {
    constructor () {
        super(
            dataAdapterFactory.createForecastWeatherAdapter(),
            "http://api.openweathermap.org/data/2.5/forecast"
        )
    }
    // @override
    prepareFetchParams({lat, lon}) {
        return {lat, lon}
    }
    // @override
    loadOneBy({lat, lon}) {
        try {
            return this.adapter.loadOneBy("coordinates", approximateCoordinates({lat, lon}))
        } catch(error) {
            console.error("Error loading in ForecastWeatherDataManager.loadOneBy()")
            throw error
        }
    }
    // @override
    setOverdue(entry) {
        const expirationDate = this.getExpirationTime();
        return {...entry, due_dt: expirationDate}
    }
    // @override
    processFetchedData(data) {
        /* TODO: 
            Complete. Data will be returned in form of a list, 
            I need to get weather data for every day at the time, that is most close to the current time
            After that I need to store that resulting list to the indexedDB and set overdue time
        */
       
        const coordinates = approximateCoordinates({lat: data.city.coord.lat, lon: data.city.coord.lon})

        const dailyWeatherList = extractEveryDayData(data.list)

        return this.setOverdue({
            coordinates,
            data : {
                ...data,
                list : dailyWeatherList
            },
            lat : data.city.coord.lat,
            lon : data.city.coord.lon,
        });
    }

    getExpirationTime() {
        const now = new Date();
        const newDate = new Date();
        const nextDay = new Date()

        nextDay.setDate(nextDay.getDate() + 1)
        nextDay.setHours(0, 0, 0, 0)
        if ((nextDay - now) / 3.6e6 < WEATHER_DATA_EXPIRATION_TIME_HOURS) {
            // New day will come sonner, than expiration time passes
            return nextDay.getTime()
        } else {
            newDate.setHours(newDate.getHours() + WEATHER_DATA_EXPIRATION_TIME_HOURS);
            return newDate.getTime();
        }
    }
    async getData({lat, lon}) {
        /*
            simple wrapper around getData method, 
            because user can accedentally specify insufficient coordinates, so I need to catch FetchError and throw CoordinatesError
        */
        try {
            return await super.getData({lat, lon})
        } catch(error) {
            if (error instanceof FetchError) {
                if (error.body.statusText === "Bad Request") {
                    // Bad Request most likely means, that user specified infufficient coordinates
                    throw new CoordinatesError(error.body)
                } else {
                    // most likely is network error
                    throw error
                }
            }
        }
    }
}

const forecastWeatherDataManager = new ForecastWeatherDataManager()
export default forecastWeatherDataManager
