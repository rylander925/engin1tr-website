import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useConditions } from '../../../ConditionsContext'
import './SoundHandler.css'

function SoundHandler() {
  const [accepted, setAccepted] = useState(false)
  const {weather} = useConditions()
  const audio = useRef(null)

  const handleAccept = () => {
    audio.current = {
      rainHeavy: new Howl({src: ['/sounds/Heavy Rain.wav']}),
      rainLight: new Howl({src: ['/sounds/Light Rain.wav']}),
      windStrong: new Howl({src: ['/sounds/Strong Wind.wav']}),
      windLight: new Howl({src: ['/sounds/Light Wind.wav']})
    }
    Object.values(audio.current).forEach(sound => {
      sound.loop(true)
      sound.volume(0)
      sound.play()
    })
    setAccepted(true)
  }

  const updateSound = (heavy, light, value, thresh, duration) => {
    heavy.fade(heavy.volume(), Math.max((value - thresh) * 2, 0), duration)
    light.fade(light.volume(), Math.min(value / thresh, 1), duration)
  }

  useEffect(() => {
    if (!accepted) return
    const {rainHeavy, rainLight, windStrong, windLight} = audio.current
    const {precipitation, windSpeed} = weather

    const thresh = 0.5
    const duration = 1000

    updateSound(rainHeavy, rainLight, precipitation, thresh, duration)
    updateSound(windStrong, windLight, windSpeed, thresh, duration)
  }, [weather])
  
  if (accepted) return null

  return (
    <>
      <div className='sound-overlay' onClick={handleAccept}>
        <h1>This website has sound</h1>
        <h3>Click anywhere to accept</h3>
      </div>
    </>
  )
}

export default SoundHandler