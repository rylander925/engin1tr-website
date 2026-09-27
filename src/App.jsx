import { useState } from 'react'
import Garden from './components/Body/Garden/Garden.jsx'
import Background from './components/Body/Background/Background.jsx'
import Menu from './components/Menu/Menu.jsx'
import Timer from './components/Menu/Timer/Timer.jsx'
import Clouds from './components/Body/SkyProps/Clouds/Clouds.jsx'
import Stars from './components/Body/SkyProps/Stars/Stars.jsx'
import Clock from './components/Menu/Clock/Clock.jsx'
import SoundHandler from './components/Body/SoundHandler/SoundHandler.jsx'
import { ConditionsProvider }  from './ConditionsContext.jsx'
import { GardenContextProvider } from './GardenContext.jsx'
import './App.css'

function App() {
  return (
    <>
      <ConditionsProvider>
        <SoundHandler />
        <GardenContextProvider>
          <div className = 'background'>
            <Background >
              <div className = 'screen-text'>
                <Menu />
                <Timer />
                <Clock />
              </div>
              <Clouds />
              <Garden />
              <Stars />
            </Background>
          </div>
        </GardenContextProvider>
      </ConditionsProvider>
    </>
  )
}

export default App
