import { useState } from 'react'
import Grass from './components/Body/Garden/Grass.jsx'
import Garden from './components/Body/Garden/Garden.jsx'
import Background from './components/Body/Background/Background.jsx'
import WeatherUI from './components/Menu/WeatherUI/WeatherUI.jsx'
import Timer from './components/Menu/Timer/Timer.jsx'
import Clouds from './components/Body/SkyProps/Clouds.jsx'
import { ConditionsProvider, useConditions, useConditionsDispatch }  from './ConditionsContext.jsx'
import './App.css'

function App() {
  return (
    <>
      <ConditionsProvider>
        <Background className = 'background'>
          <div className = 'menu'>
            <WeatherUI />
            <Timer/>
          </div>
          <Clouds />
          <Garden />
        </Background>
      </ConditionsProvider>
    </>
  )
}

export default App
