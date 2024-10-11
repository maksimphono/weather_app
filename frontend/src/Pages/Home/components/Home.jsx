import React, {useState} from 'react'

export default function Home() {
    const [weather, setWeather] = useState({})
    const [lon, setLon] = useState(0)
    const [lat, setLat] = useState(0)

    const submitForm = async (event) => {
        event.preventDefault()
        console.dir(lon, lat)

        const res = await fetch(`http://localhost:8000/api/coords?lon=${lon}&lat=${lat}`)
        console.dir(res.json())
        //setWeather(res)
    }

    return (
        <div>
            <h1>Let's check weather by coordinates</h1>
            <form method='get' onSubmit={submitForm}>
                <label name="lon">
                    <span>Lontitude</span>
                    <input value = {lon} onChange={(e) => setLon(e.target.value)} type="number" />
                </label>
                <label name="lat">
                    <span>Latitude</span>
                    <input value = {lat} onChange={e => setLat(e.target.value)} type="number" />
                </label>
                <input type="submit" />
            </form>
            <p style = {{
                    display: "flex",
                    justifyContent: "center", 
                    width: "100%",
                    height: "auto",
                    whiteSpace: "normal",

                }}>
                {JSON.stringify(weather)}
            </p>
        </div>
    )
}
