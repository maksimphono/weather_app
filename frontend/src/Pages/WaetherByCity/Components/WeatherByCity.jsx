import React, {useState} from 'react'

export default function () {
    const [weather, setWeather] = useState({main : "sunny"})
    const [cityName, setCityName] = useState("")

    const submitForm = async (event) => {
        event.preventDefault()
        console.dir(lon, lat)

        //localStorage.setItem('weather', "rain")
        setWeather(localStorage.getItem('weather'))
        //const res = await fetch(`http://localhost:8000/api/coords?lon=${lon}&lat=${lat}`)
        //console.dir(res.json())
        //setWeather(res)
    }

    return (
        <div>
            <form method='get' onSubmit={submitForm}>
                <label name="city">
                    <input value = {cityName} onChange={(e) => setCityName(e.target.value)} type="text" />
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    )
}
