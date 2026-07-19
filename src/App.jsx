import { useState } from 'react'
import Garden from './components/Body/Garden/Garden.jsx'
import Background from './components/Body/Background/Background.jsx'
import Menu from './components/Menu/Menu.jsx'
import Timer from './components/Menu/Timer/Timer.jsx'
import Clouds from './components/Body/SkyProps/Clouds/Clouds.jsx'
import Stars from './components/Body/SkyProps/Stars/Stars.jsx'
import Clock from './components/Menu/Clock/Clock.jsx'
import { ConditionsProvider }  from './ConditionsContext.jsx'
import { GardenContextProvider } from './GardenContext.jsx'
import './App.css'

function App() {
  return (
    <>
      <ConditionsProvider>
        <GardenContextProvider>
          <Background className = 'background'>
            <Menu />
            <div className = 'screen-text'>
              <Timer />
              <Clock />
            </div>
            <Clouds />
            <Garden />
            <Stars />
          </Background>
        </GardenContextProvider>
      </ConditionsProvider>
    </>
  )
}

export default App
