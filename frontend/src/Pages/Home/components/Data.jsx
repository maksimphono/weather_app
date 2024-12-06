import React, {useEffect} from 'react'
import dataAdapterFactory from '../utils/DataAdapterFactory'

export default function Data() {
    useEffect(() => {(async () => {
        console.log("Qwert")
        const adapter = await dataAdapterFactory.createUserFollowingListAdapter()
        console.log(adapter)
        //await adapter.save({coordinates : {lat : 13.75, lon : 95.93}, name : "Bangkok", country_code : "TH"})
        //await adapter.save({coordinates : {lat : 22.797401, lon : 108.1783688}, name : "Nanning", country_code : "CN"})
        //await adapter.removeOne("coordinates", "22.797401,108.1783688")
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
