import { useState, useEffect } from 'react'
import './Timer.css'

function formatElapsed(totalSeconds) {
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60) % 60
  const hours = Math.floor(totalSeconds / 3600)
  
  let output = `${seconds}s`
  if (minutes > 0) { output = `${minutes}min ` + output}
  if (hours > 0) { output = `${hours}hr ` + output}
  return output
}

function Timer( {hoverTime, setHoverTime, isHovering}) {
  const UPDATE_TIME = 1

  useEffect(() => {
    if(!isHovering) { return }
    const intervalId = setInterval(() => setHoverTime(prev => prev + 1), UPDATE_TIME)
    return () => clearInterval(intervalId)
  }, [isHovering])

  return (
    <section id="center">
      <div>You've been touching grass for {formatElapsed(hoverTime)}</div>
    </section>
  )
}

export default Timer