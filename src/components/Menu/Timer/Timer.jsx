import { useState, useEffect } from 'react'
import { useConditions, useConditionsDispatch } from '../../../ConditionsContext.jsx'
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

function Timer() {
  const conditions = useConditions();
  const dispatch = useConditionsDispatch();
  const updateTime = 1000/conditions.speed //Time in MS between 1s intervals

  useEffect(() => {
    if(!conditions.isHovering) { return }
    const intervalId = setInterval(() => {dispatch({ type: 'increment-time' })}, updateTime)
    return () => clearInterval(intervalId)
  }, [conditions.isHovering])

  return (

      <div className='counter'>You've been touching grass for {formatElapsed(conditions.elapsedTime)}</div>
  )
}

export default Timer