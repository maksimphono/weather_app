import React, { memo } from 'react'
import Navbar from './Navbar'
import {Outlet} from "react-router-dom"

export default memo(function Layout() {
  return (
    <>
        <Navbar />
        <Outlet />  
    </>
  )
})
