/*
    _____                  ____            __            __        _   _               
   |  __ \                |  _ \           \ \          / /       | | | |              
   | |  | | __ _ _   _    | |_) | _   _     \ \        / /__  __ _| |_| |__   ___ _ __ 
   | |  | |/ _` | | | |   |  _ < | | | |     \ \  /\  / / _ \/ _` | __| '_ \ / _ \ '__|
   | |__| | (_| | |_| |   | |_) || |_| |      \ \/  \/ / |__/ (_| | |_| | | |  __/ |   
   |_____/ \__,_|\__, |   |____/  \__, |       \__/\__/ \___|\__,_|\__|_| |_|\___|_|   
                  __/ |            __/ |                                            
                 |___/            |___/                                             
    _____ _                    __  __                                   
   |_   _(_)_ __ ___   ___    |  \/  | __ _ _ __   __ _  __ _  ___ _ __ 
     | | | | '_ ` _ \ / _ \   | |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__|
     | | | | | | | | |  __/   | |  | | (_| | | | | (_| | (_| |  __/ |   
     |_| |_|_| |_| |_|\___|   |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|   
                                                        |___/           
*/
import DataManager, { FetchError } from "./DataManager.js"
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import approximateCoordinates from "../utils/approximateCoordinates.js"

import Debugger from "../../utils/Debugger"
export const OneDayWeatherDataManager_class_Debugger = new Debugger("OneDayWeatherDataManager_class_Debugger")

const WEATHER_DATA_EXPIRATION_TIME_HOURS = 6

export class CoordinatesError extends Error {
    constructor(body) {
        super("Coordinates Error")
        this.body = body
    }
}

class OneDayWeatherDataManager extends DataManager {
    constructor () {
        super(
            dataAdapterFactory.createOneDayWeatherAdapter(),
            "https://api.openweathermap.org/data/2.5/weather"
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
            console.error("Error loading in OneDayWeatherDataManager.loadOneBy()")
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
        const coordinates = approximateCoordinates({lat: data.coord.lat, lon: data.coord.lon})

        return this.setOverdue({
            coordinates,
            data : data,
            lat : data.coord.lat,
            lon : data.coord.lon,
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

const oneDayWeatherDataManager = new OneDayWeatherDataManager()
export default oneDayWeatherDataManager
