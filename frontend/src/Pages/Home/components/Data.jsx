import React, {useEffect} from 'react'
import DataAdapter from '../DataAdapter/DataAdapter'

export default function Data() {
    useEffect(() => {(async () => {
        const adapter = new DataAdapter("Country codes", [{name : "code"}, {name : "country"}], "code")
        await adapter.openDB()
        //await adapter.saveOne({"code": "RU", "country" : "Russia"})
        await adapter.saveMany([{code: "RU", country : "Russia"}, {code: "CN", country : "China"}, {code: "US", country : "United States"}])
        //console.info(await adapter.removeManyBy("value", "ce"))
        console.info(await adapter.loadAll())
        await adapter.saveOne({code : "RU", country : "RF"})
        console.info(await adapter.loadAll())
    })()}, [])

    return (
        <>

        </>
    )
}
