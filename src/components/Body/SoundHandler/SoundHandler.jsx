import { useEffect, useRef, useState } from 'react';
import { useConditions } from '../../../ConditionsContext'
import './SoundHandler.css'

function SoundHandler() {
  const [accepted, setAccepted] = useState(false)
  const {weather} = useConditions()
  const audio = useRef(null)

  useEffect(() => {
    audio.current = {
      rainHeavy: new Audio('/sounds/Heavy Rain.wav'),
      rainLight: new Audio('/sounds/Light Rain.wav'),
      windStrong: new Audio('/sounds/Strong Wind.wav'),
      windLight: new Audio('/sounds/Light Wind.wav')
    }
    Object.values(audio.current).forEach(sound => {
      sound.loop = true
    })
  }, [])

  const playSound = (sound) => {
    sound.play().catch(() => {console.log("Audio blocked")})
  }

  const transitionSound = (newSound, oldSound) => {
    // Issue: Transitions can occur at the same time
    if (newSound && !newSound.paused) return // This is an issue

    const maxVolume = 100
    const duration = 5000
    const interval = duration / maxVolume

    if (newSound) {
      newSound.volume = 0
      playSound(newSound)
    }

    let count = 0
    const changeVolume = setInterval(() => {
      count++
      const newVolume = count / maxVolume
      if (newSound) newSound.volume = newVolume
      oldSound.volume = 1 - newVolume
      if (count >= maxVolume) {
        oldSound.pause()
        clearInterval(changeVolume)
      }
    }, interval)
  }

  useEffect(() => {
    if (!accepted) return
    const {rainHeavy, rainLight} = audio.current
    const {precipitation} = weather

    if (precipitation >= 0.5) {
      transitionSound(rainHeavy, rainLight)
    }
    else if (precipitation > 0) {
      transitionSound(rainLight, rainHeavy)
    }
    else {
      transitionSound(null, rainHeavy)
      transitionSound(null, rainLight)
    }
  }, [weather])
  
  if (accepted) return null

  return (
    <>
      <div className='sound-overlay' onClick={() => setAccepted(true)}>
        <h1>This website has sound</h1>
        <h3>Click anywhere to accept</h3>
      </div>
    </>
  )
}

export default SoundHandler