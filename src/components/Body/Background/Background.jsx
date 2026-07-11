import { useState } from 'react'
import { useConditions } from '../../../ConditionsContext'
import './Background.css'

function Background({children})
{
  const conditions = useConditions()
  const weatherData = conditions?.weather; 

  let timeRange = 'day'; 
  let weatherState = 'clear'; 

  if (weatherData)
  { 
    const hour = weatherData.hour;

    if ((hour >= 5 && hour < 7) || (hour >= 17 && hour < 19))
    { 
      timeRange = 'golden-hour'; 
    }
    else if (hour >= 19 || hour < 5)
    { 
      timeRange = 'night'; 
    } 

    const isStormy = weatherData.precipitation > 0 || weatherData.cloudCover > 0.5; 
    weatherState = isStormy ? 'storm' : 'clear'; 
  }

  return ( 
    <section
      id="center"
      className="sky-container"
      data-time={timeRange}
      data-weather={weatherState}
      style=
      {{
      transition: '--sky-1 2s ease, --sky-2 2s ease, --sky-3 2s ease, --sky-4 2s ease'
      }}
      > 
      {children} 
    </section> 
  )
}
export default Background