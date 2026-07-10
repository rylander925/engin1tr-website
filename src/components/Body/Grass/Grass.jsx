import { useState } from 'react'
import './Garden.css'
import grassImg from '../../../assets/plants/grass1.svg'
import { useConditionsDispatch } from '../../../ConditionsContext.jsx'

function Grass( {onHoverChange} ) {
  const dispatch = useConditionsDispatch();
  return (
    <img 
      src={grassImg} 
      className="maingrass" 
      alt="Grass Image" 
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    />
  )
}

export default Grass