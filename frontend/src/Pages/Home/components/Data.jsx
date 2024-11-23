import React, {useEffect} from 'react'
import DataAdapter from '../DataAdapter/DataAdapter'

export default function Data() {
    useEffect(() => {(async () => {
        const adapter = new DataAdapter("mystore", [{name : "city"}, {name : "value"}])
        await adapter.openDB()
        await adapter.saveMany([{city : "London", vlue : "a"}, {city : "Paris", value : "b"}, {city : "Berlin", value : "c"}])
        await adapter.loadOneBy("city", "London")
    })()}, [])

    return (
        <>

        </>
    )
}
