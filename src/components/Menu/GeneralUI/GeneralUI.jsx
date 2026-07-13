import { useConditions, useConditionsDispatch } from '../../../ConditionsContext'
import { useState, useEffect } from 'react'
import './GeneralUI.css'

function GeneralUI() {
  const dispatch = useConditionsDispatch()
  const conditions = useConditions()

  const [time, setTime] = useState(conditions.elapsedTime)
  const [seed, setSeed] = useState(conditions.seed)
  const [speed, setSpeed] = useState(conditions.speed)

  useEffect(() => {
    setTime(conditions.elapsedTime);
  }, [conditions.elapsedTime]);

  useEffect(() => {
    setSeed(conditions.seed);
  }, [conditions.seed]);

  useEffect(() => {
    setSpeed(conditions.speed);
  }, [conditions.speed]);

  const handleButton = () => {
    dispatch({type: 'update-general',
      elapsedTime: time || 0,
      seed: seed || 0,
      speed: speed || 0
    })
  }

  const betterParse = (value) => {
    const onlyDigits = value.replace(/\D/g, "")
    if (onlyDigits === "") return ""
    return parseInt(onlyDigits)
  }

  return (
    <>
      <div className='general-container'>
        <label>Time (seconds):</label>
        <input
          type='text'
          placeholder='Time'
          value={time}
          onChange={e => setTime(betterParse(e.target.value))}
        />

        <label>Seed:</label>
        <input
          type='text'
          placeholder='Seed'
          value={seed}
          onChange={e => setSeed(betterParse(e.target.value))}
        />

        <label>Speed multiplier:</label>
        <input
          type='text'
          placeholder='Speed'
          value={speed}
          onChange={e => setSpeed(betterParse(e.target.value))}
        />

        <div style={{height: '1rem'}} />
        <button onClick={handleButton}>Save</button>
      </div>
    </>
  )
}

export default GeneralUI