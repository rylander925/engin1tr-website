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
      onMouseEnter={() => dispatch({type:'set-hovering'})}
      onMouseLeave={() => dispatch({type:'unset-hovering'})}
    />
  )
}

export default Grass