import { useState } from 'react'
import { useConditions } from '../../../ConditionsContext'
import './Background.css'

function Background({children}) {
  const conditions = useConditions()
  const time = conditions.weather.hour
  
  return (
    <section id="center" className="sky-container">
      <div style={{ padding: '20px', color: '#2c3e50', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
        Sky Gradient Layer Active
        {children}
      </div>
    </section>
  )
}

export default Background