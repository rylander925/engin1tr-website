import { useConditions, useConditionsDispatch } from '../../../ConditionsContext'
import './WeatherUI.css'

function WeatherUI() {
  const dispatch = useConditionsDispatch()
  const conditions = useConditions()
  
  const handleButton = async () => {
    const cleanZip = conditions.zipCode.trim()
    if (!cleanZip || cleanZip.length != 5 || isNaN(cleanZip)) {
      const errMsg = "ZIP code empty or invalid"
      dispatch({type: 'update-locationName', locationName: errMsg})
      console.log(errMsg)
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
      const {latitude, longitude, name} = location
      
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,wind_speed_10m,cloud_cover&timezone=auto`
      const weatherRes = await fetch(weatherURL)
      if (!weatherRes.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const weatherData = await weatherRes.json()
      const currentWeather = weatherData?.["current"]
      if (!currentWeather) {
        throw new Error("No weather found at location")
      }

      dispatch({type: 'update-locationName', locationName: name})
      dispatch({type: 'update-weather', weather: currentWeather})
    }
    catch (e) {
      dispatch({type: 'update-locationName', locationName: e.message})
      console.log(e.message)
    }
  }

  const handleSlider = (field, value) => {
    dispatch({type: 'update-weather-field', field: field, value: parseFloat(value)})
  }

  const formatPercent = (value) => {
    return (value * 100).toFixed(0) + "%"
  }

  return (
    <>
      <div className='weather-container'>
        <label>Weather Location:</label>
        <input
          type='text'
          placeholder='Enter ZIP code'
          value={conditions.zipCode}
          onChange={e => dispatch({type: 'update-zipCode', zipCode: e.target.value})}
        />
        <div style={{height: '0.3rem'}} />
        <button onClick={handleButton}>Confirm</button>
        <label>{conditions.locationName}</label>

        <hr></hr>

        <label>Rain: {formatPercent(conditions.weather.precipitation)}</label>
        <input type="range" min="0" max="1" step="0.05"
          value={conditions.weather.precipitation}
          onChange={e => handleSlider('precipitation', e.target.value)}
        />

        <label>Wind: {formatPercent(conditions.weather.windSpeed)}</label>
        <input type="range" min="0" max="1" step="0.05"
          value={conditions.weather.windSpeed}
          onChange={e => handleSlider('windSpeed', e.target.value)}
        />

        <label>Clouds: {formatPercent(conditions.weather.cloudCover)}</label>
        <input type="range" min="0" max="1" step="0.05"
          value={conditions.weather.cloudCover}
          onChange={e => handleSlider('cloudCover', e.target.value)}
        />

        <label>Hour: {conditions.weather.hour}</label>
        <input type="range" min="0" max="24" step="0.5"
          value={conditions.weather.hour}
          onChange={e => handleSlider('hour', e.target.value)}
        />
      </div>
    </>
  )
}

export default WeatherUI