import { useState } from 'react'
import Body from './components/Body/Body.jsx'
import NextSteps from './components/NextSteps/NextSteps.jsx'
import './App.css'

function App() {
  return (
    <>
      <Body />

      <div className="ticks"></div>

      <NextSteps />

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
