import { useState } from 'react'
import './Background.css'

function Background({children}) {
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