import React from 'react'
import Layout from './Layout.jsx'
import OneDayWeather from './Pages/Home/components/OneDayWeather.jsx'
import Forecast from './Pages/Home/components/Forecast.jsx'
//import WeatherByCity from './Pages/WaetherByCity/Components/WeatherByCity.jsx'
//import WeatherByCoordinates from './Pages/WaetherByCity/Components/WeatherByCoordinates.jsx'
import { HashRouter, Route, Routes } from 'react-router-dom'
import "./global.css"
import Data from './Pages/Home/components/Data.jsx'

export default function App() {
    return (
      <HashRouter>
        <Routes>
          <Route path = "/" element = {<Layout/>}>
            <Route index element = {<OneDayWeather />}/>
          </Route>
          <Route path = "/tests">
            <Route index element = {<Forecast />}/>
          </Route>
        </Routes>
      </HashRouter>
    )
}
/*
<HashRouter>
      <Routes>
        <Route path = "/" element = {<h1>Qwerty</h1>}>
          <Route index element = {<h1>Qwerty</h1>}/>
        </Route>
        <Route path = "tests">
          <Route index element = {<h1>Tests</h1>}/>
        </Route>
      </Routes>
    </HashRouter>
*/