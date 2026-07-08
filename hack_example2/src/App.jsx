import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App()
{
  const [count, setCount] = useState(0)

  return
  (
    <div>
       <h1>Calculator</h1>
         <div className = "numbers-grid">
            <button>9</button>
            <button>8</button>
            <button>7</button>
            <button>6</button>
            <button>5</button>
            <button>4</button>
            <button>3</button>
            <button>2</button>
            <button>1</button>
            <button>0</button>
            <button>=</button>
          </div>
    
          <div className = "operators-grid">

          </div>
    </div>
  )
}

export default App
