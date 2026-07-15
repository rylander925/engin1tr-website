import { useConditions, useConditionsDispatch } from '../../../ConditionsContext'
import { useGarden, useGardenDispatch } from '../../../GardenContext'
import { useState, useEffect } from 'react'
import './GeneralUI.css'

function GeneralUI() {
  const dispatch = useConditionsDispatch()
  const conditions = useConditions()

  const garden = useGarden()
  const gardenDispatch = useGardenDispatch()

  const [time, setTime] = useState(garden.elapsedTime)
  const [seed, setSeed] = useState(conditions.seed)
  const [speed, setSpeed] = useState(garden.speed)

  useEffect(() => {
    setTime(garden.elapsedTime);
  }, [garden.elapsedTime]);

  useEffect(() => {
    setSeed(conditions.seed);
  }, [conditions.seed]);

  useEffect(() => {
    setSpeed(garden.speed);
  }, [garden.speed]);

  const handleButton = () => {
    gardenDispatch({type: 'set-time', elapsedTime: time || 0});
    gardenDispatch({type: 'set-speed', speed: speed || 0});
    dispatch({type: 'set-seed', seed: seed || 0});
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