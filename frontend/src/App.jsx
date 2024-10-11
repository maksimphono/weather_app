import React from 'react'
import Layout from './Layout.jsx'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import "./global.css"

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Layout/>}>
            <Route index element = {<h1>Qwerty</h1>}/>
            <Route path = "qqqq" element = {<h1>Qwe</h1>}/>
          </Route>
          <Route path = "tests">
            <Route index element = {<h1>Tests</h1>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    )
}
/*
<BrowserRouter>
      <Routes>
        <Route path = "/" element = {<h1>Qwerty</h1>}>
          <Route index element = {<h1>Qwerty</h1>}/>
        </Route>
        <Route path = "tests">
          <Route index element = {<h1>Tests</h1>}/>
        </Route>
      </Routes>
    </BrowserRouter>
*/