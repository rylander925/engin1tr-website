import { useState, useEffect } from 'react'
import cloud1 from '../../../assets/clouds/cloud1.svg'
import cloud2 from '../../../assets/clouds/cloud2.svg'
import cloud3 from '../../../assets/clouds/cloud3.svg'
import cloud4 from '../../../assets/clouds/cloud4.svg'
import { useConditions } from '../../../ConditionsContext'
import './Clouds.css'

const VARIANTS = [cloud1, cloud2, cloud3, cloud4]

//cloud gen controls
const WIDTH_AVERAGE = 20            // Average cloud with as percentage of vw at 50% cloud cover
const WIDTH_RANGE = 10              // Range in cloud with as percentage of vw
const CLOUD_COVER_FACTOR = 3        // Amount to multiply width * cloudcover * cloudcoverFactor
const MIN_CLOUD_COVER_SCALE = 0.1   // Minimum cloud scaling when cloud cover is small
const Y_RANGE = 100                 // Range in y values from top as a percent
const LEAN_RANGE = 30               // Range of cloud rotation in degrees (around vertical)
const HUE_SHIFT_RANGE = 40          // Range in hue shift about unchanged image 
const OPACITY_RANGE = 0.3           // Range of random decrease in opacity

//Cloud elevation controls
const ELEVATION_DURATION_FACTOR = 2         //Increases cloud speed to tune the decrease in duration from closeness
const ELEVATION_HEIGHT_MIN = 0.05           //Minimum amount to scale cloud height when at the horizon
const ELEVATION_WIDTH_MIN = 0.1
const HORIZON_OPACITY = 0.5                 //Minimum opacity (applies to clouds on horizon)
const HORIZON_SATURATION = 0.5              //Minimum saturation ^
const HORIZON_BRIGHTNESS_INCREASE = 0.15     //Increased brightness of clouds at horizon (complements desaturation)

//Animation controls
const BASE_DRIFT_DURATION = 50      //How long each cloud is on screen; actual reduced by windSpeed
const DURATION_FACTOR_RANGE = 0.2   //Range in speeds clouds can move 
const MAX_WIND_SPEED = 3            //Divides base duration; multiplied by conditions.weather.windSpeed (so at max windspeed, base duration will be divided by 3)
const MIN_WIND_SPEED = 0.1
const MAX_CLOUDS = 70               //Clouds when cloud cover is 100%

const GUST_INTERVAL = 10000 // ms between automatic wind gusts
const GUST_DURATION = 4000   // ms the gust class stays applied

//TODO: Add support for different cloud types


function Cloud( {cloud, index, cloudCover, driftDuration, visible, rerollCloud} ) {
    driftDuration = ELEVATION_DURATION_FACTOR * driftDuration / cloud.closenessFactor * cloud.driftFactor;
    const cloudCoverScale = linear(cloudCover, MIN_CLOUD_COVER_SCALE) * CLOUD_COVER_FACTOR; //amount to scale cloud cover by: factor * linear function between minCloudCover & 1
    return(
        //Position wrapper
        <div
            className='cloud'
            onAnimationIteration={() => rerollCloud(index)}
            style = {{
                transformOrigin: 'bottom center',
                '--drift-duration': `${driftDuration}s`,
                '--drift-delay': `${driftDuration * cloud.delay}s`,
                top: `${cloud.y}%`,
                position: 'absolute',
            }}
            >
                <img
                    className='cloud-image'
                    src = {cloud.src}
                    style = {{
                        display: 'block',
                        width: `${cloud.width * cloudCoverScale}vw`,
                        
                        transformOrigin: 'bottom center',
                        transform: `scaleX(${cloud.scaleX * cloud.flip ? -1 : 1}) 
                                    scaleY(${cloud.scaleY})
                                    translateY(-50%)
                                    rotate(${cloud.lean}deg)`,
                        filter: `hue-rotate(${cloud.hue}deg) 
                                saturate(${linear(cloud.closenessFactor, HORIZON_SATURATION)}) 
                                brightness(${1 + (1-cloud.closenessFactor)*HORIZON_BRIGHTNESS_INCREASE})`,
                        opacity: visible ? cloud.opacity * linear(cloud.closenessFactor, HORIZON_OPACITY) : 0,
                    }}
                />
        </div>
    )
}

function generateCloud(index, prepopulateSky = false) {
    const y = Y_RANGE * Math.random()
    const elevationFactor = Math.min(y / 100, 0.97)           //0 = zenith, 1 = horizon, bottom out at 0.97
    const closenessFactor = Math.cos(Math.PI/2 * elevationFactor)   //1 = straight up (closest), 0 = horizon, infinitely far away
        return {
            id: index,
            version: 0,
            src: VARIANTS[Math.floor(Math.random() * VARIANTS.length)],
            
            //If prepoulate sky is set, forces clouds to prepulate screen
            delay: Math.random() * (prepopulateSky ? -1 : 1),
            
            //Elevation dependent generation
            y: y,
            driftFactor: 1 + (Math.random() - 0.5) * DURATION_FACTOR_RANGE,
            closenessFactor: closenessFactor,
            scaleY: linear(closenessFactor, ELEVATION_HEIGHT_MIN),
            scaleX: linear(closenessFactor, ELEVATION_WIDTH_MIN),

            //Cloud variation
            width: WIDTH_AVERAGE + (Math.random() - 0.5) * WIDTH_RANGE,
            flip: Math.random() < 0.5,
            lean: (Math.random() - 0.5) * LEAN_RANGE,
            hue: (Math.random() - 0.5) * HUE_SHIFT_RANGE,
            opacity: 1 - (Math.random() * OPACITY_RANGE),
        }
}

//Returns f(x) satisfying f(0) = 0 and f(1) = 1.
//f(x) is continuous and concave down
//Function is steeper as b -> 0
//Function is more linear as b -> infinity
function steepHill(x, b) {
    const c = b*(b+1);
    const a = c/b;
    return a - c/(x+b)
}

//Returns f(x) where f(x) is a linear function passing through (0, min) (1, 1)
function linear(x, min) {
    return min + (1-min)*x
}

export default function Clouds() {
    const conditions = useConditions();

    const driftDuration = BASE_DRIFT_DURATION / (MAX_WIND_SPEED * linear(conditions.weather.windSpeed, 0.1));
    const visibleClouds = MAX_CLOUDS * steepHill(conditions.weather.cloudCover, 0.1)

    const [clouds, setClouds] = useState(() => Array.from({length:MAX_CLOUDS}, (_, i) => generateCloud(i, true))); //NOTE ID assigned to clouds is index + 1, not index

    const rerollCloud = (index) => {
        setClouds((prev) => {
            const nextClouds = [...prev];
            const newCloud = generateCloud(index);
            newCloud.version = prev[index].version + 1;
            nextClouds[index] = newCloud
            return nextClouds;
        });
    };

    return (
        <div className = 'clouds'
        >
            {
                clouds.map((cloud, index) => 
                <Cloud 
                    key={`${index}-${cloud.version}`} 
                    cloud={cloud} 
                    cloudCover={conditions.weather.cloudCover} 
                    visible={index < visibleClouds} 
                    driftDuration={driftDuration} 
                    elapsedTime={conditions.elapsedTime} 
                    index={index} 
                    rerollCloud={rerollCloud}
                    />
                )
            }
        </div>
    );
}