import { useState, useEffect } from 'react'
import NextSteps from './components/Menu/NextSteps.jsx'
import Grass from './components/Body/Grass/Grass.jsx'
import Garden from './components/Body/Grass/Garden.jsx'
import Background from './components/Body/Background/Background.jsx'
import WeatherUI from './components/Menu/WeatherUI/WeatherUI.jsx'
import Timer from './components/Menu/Timer/Timer.jsx'
import { ConditionsProvider, useConditions, useConditionsDispatch }  from './ConditionsContext.jsx'
import './App.css'

function App() {
  const [isHovering, setIsHovering] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)
  
  return (
    <>
      <ConditionsProvider>
        <Background />
        <WeatherUI />
        <Timer hoverTime = {hoverTime} 
              setHoverTime={setHoverTime} 
              isHovering={isHovering}/>

        <div className="ticks"></div>

        <div className="ticks"></div>
        <section id="spacer"></section>
        <Grass onHoverChange = {setIsHovering}/>
        <Garden 
          onHoverChange = {setIsHovering}
          hoverTime = {hoverTime}
        />
      </ConditionsProvider>
    </>
  )
}

export default App
