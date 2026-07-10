import { useState } from 'react'
import './Garden.css'
import grassImg from '../../../assets/plants/grass1.svg'

function Grass( {onHoverChange} ) {
  return (
    <section id="center">
      
      <img 
        src={grassImg} 
        className="maingrass" 
        alt="Grass Image" 
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      />
    </section>
  )
}

export default Grass