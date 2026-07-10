import { useState } from 'react'
import './Grass.css'
import grassImg from '../../../assets/plants/grass1.svg'
console.log("Grass Image Src: ", grassImg)

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