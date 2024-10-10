//import "../define.scss"
import React, { useContext } from 'react'
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
        <div>
            <Link to="/" />
        </div>
        <ul>
            <li><Link to="/"></Link></li>
            <li><Link to="/"></Link></li>
        </ul>
    </nav>
  )
}
