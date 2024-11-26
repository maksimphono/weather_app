import React, {useEffect} from 'react'
import DataAdapter from '../DataAdapter/DataAdapter'
import dataAdapterFactory from '../utils/DataAdapterFactory'
import { geodecodeFetcher } from '../DataFetcher/DataFetcher'


export default function Data() {
    useEffect(() => {(async () => {
        const fetcher = geodecodeFetcher
        console.log(fetcher.ready)
        const res = await fetcher.getData("London", "")
        console.dir(res)
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
