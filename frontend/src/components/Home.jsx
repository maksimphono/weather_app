import React, { lazy, useState, Suspense } from 'react'
import style from "./style.module.scss"
import Icon from "./icon.png"

const Btn = lazy(() => import("./Btn.jsx"))

export default function Home() {
  const [count, setCount] = useState(0)
  
    return (
    <>
      <h1>Homepage {count}</h1>
      <div className = {style["ico"]}></div>
      <img src={Icon} alt="" />
      <button className = {style["button"]} onClick = {() => setCount(v => v + 1)}>Plus</button>
      <Suspense fallback = {<h2>Loading</h2>}>
        <Btn />
      </Suspense>
    </>
  )
}
//<button disabled className = {style["button"]} onClick = {() => setCount(v => v + 1)}>Plus</button>
      