import { useState } from 'react'
import './Background.css'

function Background({children}) {
  return (
    <section id="center">
      {children}
    </section>
  )
}

export default Background