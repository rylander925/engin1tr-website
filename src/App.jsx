import { useState } from 'react'
import Grass from './components/Body/Garden/Grass.jsx'
import Garden from './components/Body/Garden/Garden.jsx'
import Background from './components/Body/Background/Background.jsx'
import Menu from './components/Menu/Menu.jsx'
import Timer from './components/Menu/Timer/Timer.jsx'
import Clouds from './components/Body/SkyProps/Clouds.jsx'
import { ConditionsProvider, useConditions, useConditionsDispatch }  from './ConditionsContext.jsx'
import './App.css'

function App() {
  return (
    <>
      <ConditionsProvider>
        <Background className = 'background'>
          <Menu />
          <div className = 'UI'>
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
