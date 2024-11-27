import DataManager from "./DataManager.js"
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import Debugger from "../../utils/Debugger"
export const OneDayWeatherDataManager_class_Debugger = new Debugger("OneDayWeatherDataManager_class_Debugger")

const WEATHER_DATA_EXPIRATION_TIME_HOURS = 6

export function approximateCoordinates({lat, lon}) {
    const floor2 = x => Math.floor(x * 100) / 100
    return `${floor2(lat)},${floor2(lon)}`
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
        OneDayWeatherDataManager_class_Debugger.push("OneDayWeatherDataManager.loadOneBy")
        try {
            OneDayWeatherDataManager_class_Debugger.pop()
            return this.adapter.loadOneBy("coordinates", approximateCoordinates({lat, lon}))
        } catch(error) {
            console.error("Error loading in OneDayWeatherDataManager.loadOneBy()")
            throw error
        }
    }
    // @override
    setOverdue(entry) {
        OneDayWeatherDataManager_class_Debugger.push("setOverdue")
        const expirationDate = this.getExpirationTime();
        OneDayWeatherDataManager_class_Debugger.pop()
        return {...entry, due_dt: expirationDate}
    }
    // @override
    processFetchedData(data) {
        OneDayWeatherDataManager_class_Debugger.push("processFetchedData")
        const coordinates = approximateCoordinates({lat: data.coord.lat, lon: data.coord.lon})

        OneDayWeatherDataManager_class_Debugger.pop()
        return this.setOverdue({
            coordinates,
            data : data,
            lat : data.coord.lat,
            lon : data.coord.lon,
        });
    }

    getExpirationTime() {
        OneDayWeatherDataManager_class_Debugger.push("getExpirationTime")
        const newDate = new Date();
        newDate.setSeconds(newDate.getSeconds() + 30)//WEATHER_DATA_EXPIRATION_TIME_HOURS);
        OneDayWeatherDataManager_class_Debugger.pop()
        return newDate.getTime();
    }
}

const oneDayWeatherDataManager = new OneDayWeatherDataManager()
export default oneDayWeatherDataManager
