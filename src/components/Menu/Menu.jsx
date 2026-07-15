import { useState } from 'react'
import './Menu.css'
import WeatherUI from './WeatherUI/WeatherUI'
import GeneralUI from './GeneralUI/GeneralUI'

function Menu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className='menu-container'>
        <button className='menu-button' onClick={() => setIsOpen((prev) => !prev)}>⚙️</button>
        <div className={`menu-list ${isOpen ? 'open' : ''}`}>
          <GeneralUI />
          <hr />
          <WeatherUI />
        </div>
      </div>
    </>
  )
}

export default Menu