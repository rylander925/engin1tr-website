import { useState } from 'react'
import Grass from './components/Body/Grass/Grass.jsx'
import Garden from './components/Body/Grass/Garden.jsx'
import Background from './components/Body/Background/Background.jsx'
import Menu from './components/Menu/Menu.jsx'
import Timer from './components/Menu/Timer/Timer.jsx'
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
          <Garden />
        </Background>
      </ConditionsProvider>
    </>
  )
}

export default App
