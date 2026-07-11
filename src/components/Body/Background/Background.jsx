import { useState } from 'react'
import { useConditions } from '../../../ConditionsContext'
import './Background.css'

function Background({children}) {
  const conditions = useConditions()
  const time = conditions.weather.hour
  
  return (
    <section id="center" className="sky-container">
      {children}
    </section>
  )
}

export default Background