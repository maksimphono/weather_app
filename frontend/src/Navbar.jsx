import React from 'react'
import { Link } from "react-router-dom";
import style from './Navbar.module.scss';

export default function Navbar() {
  return (
      <nav className = {style["navbar"]}>
        <ul>
            <li><Link to="/">O</Link></li>
            <li><Link to="/tests">T</Link></li>
            <li><Link to="/qqqq">Q</Link></li>
        </ul>
      </nav>
    
  )
}
