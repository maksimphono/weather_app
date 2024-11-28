import React, {useEffect} from 'react'
import DataAdapter from '../DataAdapter/DataAdapter'
import dataAdapterFactory from '../utils/DataAdapterFactory'
import {FetchError} from "../DataManager/DataManager.js"
import geodecodeDataManager, {GeodecodeDataManager_class_Debugger } from '../DataManager/GeodecodeDataManager.js'
import oneDayWeatherDataManager, {CoordinatesError, OneDayWeatherDataManager_class_Debugger} from '../DataManager/OneDayWeatherDataManager.js'
import forecastWeatherDataManager from '../DataManager/ForecastWeatherDataManager.js'

export default function Data() {
    useEffect(() => {(async () => {
        const adapter = dataAdapterFactory.createUserFollowingListAdapter()
        await adapter.openDB()
        await adapter.saveOne({coordinates : "13.7553925,95.9385771", name : "Bangkok", country_code : "TH"})
        await adapter.saveOne({coordinates : "22.797401,108.1783688", name : "Nanning", country_code : "CN"})
        await adapter.removeOneBy("coordinates", "22.797401,108.1783688")
        console.table(await adapter.loadAll())
        
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
