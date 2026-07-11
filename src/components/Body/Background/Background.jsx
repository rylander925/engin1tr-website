import { useState } from 'react'
import { useConditions } from '../../../ConditionsContext'
import './Background.css'

function Background({children})
{
  const conditions = useConditions()
  const time = conditions?.weather?.hour

  const weatherData = conditions?.weather; 
  let timeRange = 'day'; 
  let weatherState = 'clear'; 

  if (weatherData && weatherData.time)
  { 
    const dateObj = new Date(weatherData.time); 
    const hour = dateObj.getHours(); 
    if ((hour >= 5 && hour < 7) || (hour >= 17 && hour < 19))
    { 
      timeRange = 'golden-hour'; 
    }
    else if (hour >= 19 || hour < 5)
    { 
      timeRange = 'night'; 
    } 
    const isStormy = weatherData.precipitation > 0 || weatherData.cloud_cover > 50; 
    weatherState = isStormy ? 'storm' : 'clear'; 
  }

  return ( 
    <section id="center" className="sky-container" data-time={timeRange} data-weather={weatherState}> 
      {children} 
    </section> 
  )
}
export default Background