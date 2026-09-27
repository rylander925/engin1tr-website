import { useState } from 'react'
import './Menu.css'
import WeatherUI from './WeatherUI/WeatherUI'
import GeneralUI from './GeneralUI/GeneralUI'

function Menu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className='menu-container'>
        <button className='menu-button' id='screen-text' style={{ fontSize: '1.5rem'}} onClick={() => setIsOpen((prev) => !prev)}>
            ⚙
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