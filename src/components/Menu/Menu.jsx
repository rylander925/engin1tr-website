import { useState } from 'react'
import './Menu.css'
import WeatherUI from './WeatherUI/WeatherUI'
import GeneralUI from './GeneralUI/GeneralUI'

function Menu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className='menu-container'>
      <button className='menu-button' id='screen-text' onClick={() => setIsOpen((prev) => !prev)}>
          [M]
      </button>
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