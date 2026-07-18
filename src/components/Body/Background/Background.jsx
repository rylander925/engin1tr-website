import { useState } from 'react'
import { useConditions } from '../../../ConditionsContext'
import Clouds from '../SkyProps/Clouds/Clouds'
import { steepHill } from '../SkyProps/Clouds/Clouds';
import Rain from '../SkyProps/Rain/Rain';
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

    const isStormy = weatherData.precipitation > 0 || weatherData.cloudCover > 0.9; 
    weatherState = isStormy ? 'storm' : 'clear'; 
  }

  const stormOpacity = weatherData ? (weatherData.precipitation > 1 ? weatherData.precipitation / 10 : steepHill(weatherData.precipitation, 0.5)) : 0;

  return ( 
    <section
      id="center"
      className="sky-container"
      data-time={timeRange}
      data-weather={weatherState}
      style=
      {{
      transition: '--sky-1 2s ease, --sky-2 2s ease, --sky-3 2s ease, --sky-4 2s ease',
      '--rain-opacity': stormOpacity
      }}
      > 
        <Rain />
      {children} 
    </section> 
  )
}
export default Background