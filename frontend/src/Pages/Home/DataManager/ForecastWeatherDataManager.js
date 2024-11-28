import DataManager, { FetchError } from "./DataManager.js"
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import { approximateCoordinates } from "./OneDayWeatherDataManager.js"
import Debugger from "../../utils/Debugger"
export const ForecastWeatherDataManager_class_Debugger = new Debugger("ForecastWeatherDataManager_class_Debugger")

const WEATHER_DATA_EXPIRATION_TIME_HOURS = 3
const ANCHOR_TIME_HOURS = 12 // (set noon by default)


export class CoordinatesError extends Error {
    constructor(body) {
        super("Coordinates Error")
        this.body = body
    }
}


function get3hIntervalAfterAnchorTime() {
    /* That function logic: 
        Take 12 AM (noon) of the next day (in locale form),
        calculate start time of the next 3-hours interval (in ISO format),
        and return string in form of "06" which is the
        starting time (in ISO hours) of the 3-hours interval that comes after next day's noon
    */
    let getISOHours = (isodate) => isodate.slice(11, 13)
    const adjust = s => {if (s.length === 1) return "0" + s; else return s;}
    const nextNoon = new Date()
    nextNoon.setDate(nextNoon.getDate() + 1)
    nextNoon.setHours(ANCHOR_TIME_HOURS, 0, 0, 0)
    return adjust((3 * Math.ceil(parseInt(getISOHours(nextNoon.toISOString())) / 3)).toString())
}

export function extractEveryDayData(list) {
    // list[0] is the data for current day, closest time
    if (list.length !== 40) 
        // most likely the Open Weather API returned incorrect list for some reason
        return null
    // Extracting data for noon of the next day (after anchor time)
    const anchorTime = get3hIntervalAfterAnchorTime()
    console.log(anchorTime)
    const everyDayWeather = list.filter(day => day.dt_txt.slice(-8, -6) === anchorTime)
    const currentTimeWeather = list[0]

    if (parseInt(currentTimeWeather.dt_txt.slice(-8, -6)) <= parseInt(anchorTime)) {
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
        if (data?.list?.length === 0) {
            throw new Error("Data must contain a list of days")
        }

        ForecastWeatherDataManager_class_Debugger.log("Data fetched from OpenWeatherMap API:", data)
        const coordinates = approximateCoordinates({lat: data.city.coord.lat, lon: data.city.coord.lon})
        const dailyWeatherList = extractEveryDayData(data.list)

        if (dailyWeatherList?.length)
            return this.setOverdue({
                coordinates,
                data : {
                    ...data,
                    list : dailyWeatherList
                },
                lat : data.city.coord.lat,
                lon : data.city.coord.lon,
            });
        else
            // most likely, means, that the OpenWeather api didn't send data with list of weather data for every day with length of 40
            return null
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
