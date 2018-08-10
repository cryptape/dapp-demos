import React from 'react'
import './submit.css'

export default ({ text = '愿此刻永恒', onClick, disabled = false }) => (
  <button
    onClick={onClick}
    className={`confirm__button--primary ${disabled ? 'confirm__button--disabled' : ''}`}
    disabled={disabled}
  >
    {text}
  </button>
)
