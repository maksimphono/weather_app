import React, { useCallback, useContext, useEffect, useState } from 'react'
import style from "../css/Home.module.scss"
import { InputState } from './InputFields.jsx'
import dataAdapterFactory from "../utils/DataAdapterFactory.js"
import { InputStateInterface } from './Home.jsx'

export default function FollowedCitiesOverlayMenu({onClose}) {
    const [followedCities, setFollowedCities] = useState([])
    const {inputInterfaceRef} = useContext(InputStateInterface)

    useEffect(() => {
        loadFollowedCities()
    }, [])

    const loadFollowedCities = useCallback(async () => {
        const adapter = await dataAdapterFactory.createUserFollowingListAdapter();

        try {
            const cities = await adapter.loadAll();
            setFollowedCities(cities);
        } catch (error) {
            alert('Error when fetching followed cities');
        }
    }, [])

    const handleItemSelect = useCallback((item) => {
        console.log(`Select ${item.name}`)
        let state = {}
        let [lat, lon] = JSON.parse(item.coordinates)
        if (item.name !== "Unknown") {
            state = new InputState(item.name, item.country_code, lat, lon)
        } else {
            state = new InputState("", "", lat, lon)
        }

        inputInterfaceRef?.current?.setInputState(state)
        onClose()
    }, [])

    const handleRemoveFollowedCity = useCallback(async (coordinates) => {
        const adapter = await dataAdapterFactory.createUserFollowingListAdapter();

        try {
            await adapter.remove(coordinates)
            setFollowedCities(await adapter.loadAll())
        } catch(error) {
            alert("Error while removing item")
        }
    }, [])

    return (
        <div className = {style["overlaymenu"]}>
            <button onClick = {(e) => {e.preventDefault(); onClose();}}>X</button>
            <ul>
                {followedCities.map((item, index) => {
                    if (item !== undefined)
                        return (
                            <li 
                                onClick={e => {e.preventDefault(); handleItemSelect(item);}}
                                key = {item.coordinates}
                            >
                                <span>{item.name}</span>
                                <span>{item.country_code}</span>
                                <span>{item.coordinates}</span>
                                <button onClick = {(e) => {e.preventDefault(); e.stopPropagation(); handleRemoveFollowedCity(item.coordinates);}}>X</button>
                            </li>
                        ) 
                })
                }
            </ul>
        </div>
    )
}

