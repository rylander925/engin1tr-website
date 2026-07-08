import { useState } from 'react'
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
    </>
  )
}

export default App
