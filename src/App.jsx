import { useState } from 'react'
import Body from './components/Body/Body.jsx'
import NextSteps from './components/Menu/NextSteps.jsx'
import Grass from './components/Body/Grass/Grass.jsx'
import Background from './components/Body/Background/Background.jsx'
import WeatherUI from './components/Menu/WeatherUI/WeatherUI.jsx'
import Timer from './components/Menu/Timer/Timer.jsx'
import './App.css'

function App() {
  return (
    <>
      <Grass />
      <Background />
      <WeatherUI />
      <Timer />

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
