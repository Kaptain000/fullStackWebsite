import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navProgile from '../../assets/nav-profile.svg'

export const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navlogo} alt="" className="nav-logo" />
        <img src={navProgile} className='nav-profile' alt="" />
    </div>
  )
}