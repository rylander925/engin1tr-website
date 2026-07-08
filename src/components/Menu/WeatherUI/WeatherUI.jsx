import { useState } from 'react'
import './WeatherUI.css'

function WeatherUI() {
  const [zipCode, setZipCode] = useState("")
  const [city, setCity] = useState("")
  
  const handleButton = async () => {
    const cleanZip = zipCode.trim()
    if (!cleanZip || cleanZip.length != 5 || isNaN(cleanZip)) {
      console.log("ZIP code empty or invalid")
      return
    }

    setCity("")
    const url = `https://api.zippopotam.us/us/${cleanZip}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Invalid ZIP or request")
      }

      const data = await response.json()
      const placeName = data?.["places"]?.[0]?.["place name"]

      if (placeName) {
        setCity(placeName)
      }
      else {
        throw new Error("No city exists")
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  return (
    <>
      <div className='menu-container'>
        <input
          type='text'
          placeholder='Enter ZIP code'
          value={zipCode}
          onChange={e => setZipCode(e.target.value)}
        />
        <button onClick={handleButton}>Confirm</button>
        <p>{city}</p>
      </div>
    </>
  )
}

export default WeatherUI