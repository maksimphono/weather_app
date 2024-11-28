import DataManager, { FetchError } from "./DataManager.js"
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import { approximateCoordinates, CoordinatesError } from "./OneDayWeatherDataManager.js"
import Debugger from "../../utils/Debugger"
export const UserFollowingListDataManager_class_Debugger = new Debugger("UserFollowingListDataManager_class_Debugger")

class UserFollowingListDataManager extends DataManager {
    constructor () {
        super(
            dataAdapterFactory.createUserFollowingListAdapter(),
            ""
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
            console.error("Error loading in UserFollowingListDataManager.loadOneBy()")
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

const oneDayWeatherDataManager = new UserFollowingListDataManager()
export default oneDayWeatherDataManager
