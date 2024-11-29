import DataManager from "./DataManager.js"
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import Debugger from "../../utils/Debugger"
export const GeodecodeDataManager_class_Debugger = new Debugger("GeodecodeGeodecodeDataManager_class_Debugger")
import { FetchError } from "./DataManager.js"

export class CityError extends Error {
    constructor(body) {
        super("City Error")
        this.body = body
    }
}

class GeodecodeDataManager extends DataManager {
    constructor () {
        super(
            dataAdapterFactory.createGeodecodeAdapter(),   // adapter
            "http://api.openweathermap.org/geo/1.0/direct" // url
        )
    }
    // @override
    prepareFetchParams({cityName, countryCode}) {
        GeodecodeDataManager_class_Debugger.push("GeodecodeDataManager.prepareFetchParams")
        if (countryCode?.length) {
            GeodecodeDataManager_class_Debugger.pop()
            return {q : [cityName, countryCode].join(","), limit : 1}
        } else {
            GeodecodeDataManager_class_Debugger.pop()
            return {q : cityName, limit : 1}
        }
    }
    // @override
    processFetchedData(data) {
        GeodecodeDataManager_class_Debugger.push("GeodecodeDataManager.processFetchedData")
        if (!Object.keys(data).length) {
            GeodecodeDataManager_class_Debugger.pop()
            return null
        } 

        const res = data[0] 
        GeodecodeDataManager_class_Debugger.pop()
        return {
            id : [res.lat.toString(), res.lon.toString()].join(","),
            name : res.name,
            country_code : res.country,
            lat : res.lat,
            lon : res.lon,
            state : res.state || null
        }
    }
    // @override
    async loadOneBy({cityName, countryCode}) {
        GeodecodeDataManager_class_Debugger.push("GeodecodeDataManager.loadOneBy")
        if (countryCode) {
            let results = await this.adapter.loadManyBy("name", cityName)
            if (!results) {
                GeodecodeDataManager_class_Debugger.pop()
                return null
            } 

            results = results.filter(entry => entry.country_code === countryCode)
            GeodecodeDataManager_class_Debugger.pop()
            return results[0]
        } else {
            let results = await this.adapter.loadOneBy("name", cityName)
            GeodecodeDataManager_class_Debugger.pop()
            return results
        }
    }
    async getData({cityName, countryCode}) {
        /*
            simple wrapper around getData method, 
            because user can accedentally specify insufficient city, so I need to catch FetchError and throw CityError
        */
        try {
            const result = await super.getData({cityName, countryCode})
            if (result === null) {
                // most likely means that the user provided non-existing city or OpenWeatheer doesn't know about it
                throw new CityError(result)
            } else {
                return result
            }
        } catch(error) {
            if (error instanceof FetchError) {
                // most likely is network error
                throw error
            } else if (error instanceof CityError) {
                // most likely OpenWeather API does not know about that city 
                throw error
            }
        }
    }
}

const geodecodeDataManager = new GeodecodeDataManager()
export default geodecodeDataManager