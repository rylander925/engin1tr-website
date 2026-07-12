import { useState, useEffect, useMemo } from 'react'
import cloud1 from '../../../../assets/clouds/cloud1.svg'
import cloud2 from '../../../../assets/clouds/cloud2.svg'
import cloud3 from '../../../../assets/clouds/cloud3.svg'
import cloud4 from '../../../../assets/clouds/cloud4.svg'
import { Generator } from '../../Generable' 
import { useConditions, useConditionsDispatch } from '../../../../ConditionsContext'
import './Clouds.css'

const VARIANTS = [cloud1, cloud2, cloud3, cloud4]

//cloud gen controls
const HEIGHT_AVERAGE = 150  // Average cloud height
const HEIGHT_RANGE = 150     // Total cloud height range around average
const Y_RANGE = 20          // Range in y values from top as a percent
const LEAN_RANGE = 20       // Range of cloud rotation in degrees (around vertical)
const HUE_SHIFT_RANGE = 40  // Range in hue shift about unchanged image 

//Animation controls
const BASE_DRIFT_DURATION = 25      //How long each cloud is on screen; actual reduced by windSpeed
const MAX_WIND_SPEED = 3            //Divides base duration; multiplied by wind speed factor
const MAX_CLOUDS = 30               //Clouds when cloud cover is 100%

const GUST_INTERVAL = 10000 // ms between automatic wind gusts
const GUST_DURATION = 4000   // ms the gust class stays applied

//TODO: Add support for different cloud types

class CloudGenerator extends Generator {
    constructor( baseInterval, slowdownFactor, seed ) {
        super(baseInterval, slowdownFactor, seed);
    }

    generateItemAttributes(rand, index) {
        return {
            id: index,
            appearTime: this.timeForIndex(index),
            src: VARIANTS[Math.floor(rand() * VARIANTS.length)],

            //% range about center governed by index * SPREAD_RATE
            x: 100 * rand(), 
            y: Y_RANGE * rand(),

            height: HEIGHT_AVERAGE + (rand() - 0.5) * HEIGHT_RANGE,
            flip: rand() < 0.5,
            lean: (rand() - 0.5) * LEAN_RANGE,
            hue: (rand() - 0.5) * HUE_SHIFT_RANGE,
        }
    }

    static Cloud( {cloud, index, driftDuration, visible, rerollCloud} ) {
        return(
            //Position wrapper
            <div
                className='cloud'
                onAnimationIteration={() => rerollCloud(index)}
                style = {{
                    transformOrigin: 'bottom center',
                    '--drift-duration': `${driftDuration}s`,
                    '--drift-delay': `${driftDuration*cloud.delay}s`,
                    //left: `${-cloud.x}vw`,
                    top: `${cloud.y}%`,
                    position: 'absolute',
                    opacity: visible ? 1 : 0
                }}
                >
                    <img
                        src = {cloud.src}
                        style = {{
                            height: cloud.height,
                            display: 'block',
                            
                            transformOrigin: 'bottom center',
                            transform: `scaleX(${cloud.flip ? -1 : 1}) 
                                        rotate(${cloud.lean}deg)`,
                            filter: `hue-rotate(${cloud.hue}deg)`,
                        }}
                    />
            </div>
        )
    }
}

function generateCloud(index) {
        return {
            id: index,
            version: 0,
            src: VARIANTS[Math.floor(Math.random() * VARIANTS.length)],

            //% range about center governed by index * SPREAD_RATE
            delay: Math.random(),
            //x: 100 * Math.random(), 
            y: Y_RANGE * Math.random(),

            height: HEIGHT_AVERAGE + (Math.random() - 0.5) * HEIGHT_RANGE,
            flip: Math.random() < 0.5,
            lean: (Math.random() - 0.5) * LEAN_RANGE,
            hue: (Math.random() - 0.5) * HUE_SHIFT_RANGE,
        }
    }

export default function Clouds() {
    const conditions = useConditions();

    const driftDuration = BASE_DRIFT_DURATION / (MAX_WIND_SPEED * conditions.weather.windSpeed);
    const visibleClouds = MAX_CLOUDS * conditions.weather.cloudCover
    const baseInterval = driftDuration / visibleClouds; //Infinity when cloudCover is 0

    const cloudGenerator = new CloudGenerator(baseInterval, 0, conditions.seed);

    const [clouds, setClouds] = useState(() => Array.from({length:MAX_CLOUDS}, (_, i) => generateCloud(i))); //NOTE ID assigned to clouds is index + 1, not index

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
        <div className = 'cloud-bounding-box'
        >
            {
                clouds.map((cloud, index) => 
                <CloudGenerator.Cloud key={`${index}-${cloud.version}`} cloud={cloud} visible={index < visibleClouds} driftDuration={driftDuration} elapsedTime={conditions.elapsedTime} index={index} rerollCloud={rerollCloud}/>)
            }
        </div>
    );
}