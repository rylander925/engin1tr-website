import { useState } from 'react'
import './WeatherUI.css'

function WeatherUI() {
  const [zipCode, setZipCode] = useState(0)
  const [city, setCity] = useState("")
  
  const handleButton = async () => {
    const url = "https://api.zippopotam.us/us/"
    try {
      const response = await (await fetch(url + zipCode)).json()
      setCity(response["places"][0]["place name"])
    }
    catch (e) {
      console.log(e.message)
    }
  }

  return (
    <>
      <div className='menu-container'>
        <input value={zipCode} onChange={e => setZipCode(e.target.value)} />
        <button onClick={handleButton}>Confirm</button>
        <p>{city}</p>
      </div>
    </>
  )
}

export default WeatherUI