import { useState } from 'react'
import './WeatherUI.css'

function WeatherUI() {
  const [zipCode, setZipCode] = useState("")
  const [weather, setWeather] = useState(null)
  
  const handleButton = async () => {
    const cleanZip = zipCode.trim()
    if (!cleanZip || cleanZip.length != 5 || isNaN(cleanZip)) {
      console.log("ZIP code empty or invalid")
      return
    }

    const locationURL = `https://geocoding-api.open-meteo.com/v1/search?name=${cleanZip}&count=1&language=en&format=json&countryCode=US`
    try {
      const locationRes = await fetch(locationURL)
      if (!locationRes.ok) {
        throw new Error("Failed to fetch location data")
      }

      const locationData = await locationRes.json()
      const location = locationData?.["results"]?.[0]
      if (!location) {
        throw new Error("No location found at ZIP")
      }
      const {latitude, longitude} = location
      
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,wind_speed_10m,cloud_cover,is_day`
      const weatherRes = await fetch(weatherURL)
      if (!weatherRes.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const weatherData = await weatherRes.json()
      const currentWeather = weatherData?.["current"]
      if (!currentWeather) {
        throw new Error("No weather found at location")
      }

      const {
        precipitation = 0,
        wind_speed_10m = 0,
        cloud_cover = 0,
        is_day = 1
      } = currentWeather
      setWeather({
        isRaining: precipitation > 0,
        isWindy: wind_speed_10m > 20,
        isCloudy: cloud_cover > 50,
        isDay: is_day == 1
      })
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
      </div>
    </>
  )
}

export default WeatherUI