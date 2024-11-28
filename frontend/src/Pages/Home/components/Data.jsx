import React, {useEffect} from 'react'
import DataAdapter from '../DataAdapter/DataAdapter'
import dataAdapterFactory from '../utils/DataAdapterFactory'
import {FetchError} from "../DataManager/DataManager.js"
import geodecodeDataManager, {GeodecodeDataManager_class_Debugger } from '../DataManager/GeodecodeDataManager.js'
import oneDayWeatherDataManager, {CoordinatesError, OneDayWeatherDataManager_class_Debugger} from '../DataManager/OneDayWeatherDataManager.js'
import forecastWeatherDataManager from '../DataManager/ForecastWeatherDataManager.js'

export default function Data() {
    useEffect(() => {(async () => {
        const manager = forecastWeatherDataManager
        console.log(manager.ready)
        try {
            let res = await manager.getData({lat:13.7524938, lon:100.4935089})
            console.dir(res)
        }catch(error) {
            if (error instanceof CoordinatesError) {
                if (error.body.statusText === "Bad Request") {
                    console.warn("Coordinates error");
                }
            } else {
                if (error instanceof FetchError) {
                    console.warn("Network error");
                }
            }
        }

        //await adapter.saveOne({"code": "RU", "country" : "Russia"})
        //await adapter.saveMany([{code: "RU", country : "Russia"}, {code: "CN", country : "China"}, {code: "US", country : "United States"}])
        //console.info(await adapter.removeManyBy("value", "ce"))
        //console.info(await adapter.loadOneBy("code", "RU"))
        //await adapter.saveOne({code : "RU", country : "RF"})
        //console.table(await adapter.loadAll())
    })()}, [])

    return (
        <>

        </>
    )
}
