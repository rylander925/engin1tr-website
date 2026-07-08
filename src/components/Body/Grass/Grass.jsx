import { useState } from 'react'
import './Grass.css'
import grassImg from '../../../assets/grass.png'

function Grass( {onHoverChange} ) {
  return (
    <section id="center">
      <img 
        src={grassImg} 
        className="grass" 
        alt="Grass Image" 
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      />
    </section>
  )
}

export default Grass