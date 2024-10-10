import React from "react"
import {screen, render} from "@testing-library/react"
import Home from "../components/Home.jsx"
//import "jest-environment-jsdom"
import "@testing-library/jest-dom"

test("TEst", () => {
    const a = true
    expect(a).toBe(true)
})

test("Disabled", () => {
    //render(<Home />)
    //screen.findByRole("button").then(btn => expect(btn).toBeInTheDocument())
})
