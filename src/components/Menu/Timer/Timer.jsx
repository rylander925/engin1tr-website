import { useState, useEffect } from 'react'
import { useGarden } from '../../../GardenContext'
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


//Shows how long user has hovered their mouse over the grass
function Timer() {
  const garden = useGarden();

  return (
      <div className='timer' id='screen-text'>You've touched grass for {formatElapsed(garden.elapsedTime)}</div>
  )
}

export default Timer