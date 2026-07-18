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

  useEffect(() => {
    if (!accepted) return
    const {rainHeavy, rainLight} = audio.current
    const {precipitation} = weather

    rainHeavy.fade(rainHeavy.volume(),  Math.max((precipitation - 0.5) * 2, 0), 1000)
    rainLight.fade(rainLight.volume(), Math.min(precipitation / 0.5, 1), 1000)
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