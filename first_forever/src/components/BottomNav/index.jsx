import React from 'react'
import { Link } from 'react-router-dom'
import './bottomNav.css'

const BottomNav = ({ active, showAdd = true }) => (
  <div className="bottomnav__bar--container">
    <div
      className="bottomnav__button--add"
      style={{
        display: showAdd ? 'flex' : 'none',
      }}
    >
      <Link to="/add">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-plus" />
        </svg>
      </Link>
    </div>

    <div className="bottomnav__navs--container">
      <Link to="/" className={active === 'home' ? 'active' : ''}>
        <svg className={`icon`} aria-hidden="true">
          <use xlinkHref="#icon-home" />
        </svg>
      </Link>
      <Link to="/list" className={active === 'list' ? 'active' : ''}>
        <svg className={`icon`} aria-hidden="true">
          <use xlinkHref="#icon-user" />
        </svg>
      </Link>
    </div>
  </div>
)

export default BottomNav
