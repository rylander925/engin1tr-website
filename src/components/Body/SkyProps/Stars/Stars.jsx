import { useState, useEffect } from 'react'
import { useConditions } from '../../../../ConditionsContext'
import { steepHill } from '../Clouds/Clouds';
import './Stars.css'

const RADIUS_MIN = 0.05;
const RADIUS_RANGE = 0.2;
const Y_RANGE = 100                 // Range in y values from top as a percent
const HUE_SHIFT_RANGE = 40          // Range in hue shift about unchanged image 
const OPACITY_RANGE = 0.3           // Range of random decrease in opacity

const MAX_STARS = 200               //Clouds when cloud cover is 100%

function Star( {star, index, visible} ) {
    return(
        //Position wrapper
        <circle
            className = 'star'
            cx={star.cx}
            cy={star.cy}
            r = {star.r}px
            
            style = {{
                filter: `hue-rotate(${star.hue}deg)`,
                opacity: visible ? star.opacity : 0,
            }}
        >
        </circle>
    )
}

function generateStar(index) {
        return {
            id: index,
            
            //Elevation dependent generation
            cx: Math.random() * 100,
            cy: Math.random() * Y_RANGE,

            //Cloud variation
            r: RADIUS_MIN + Math.random() * RADIUS_RANGE, 
            hue: (Math.random() - 0.5) * HUE_SHIFT_RANGE,
            opacity: 1 - (Math.random() * OPACITY_RANGE),
        }
}

const CUTOFF_TIME = 6

export default function Stars() {
    const conditions = useConditions();

    const timeFactor = Math.max(Math.abs(12 - conditions.weather.hour) - CUTOFF_TIME, 0) / (12 - CUTOFF_TIME);

    const visibleStars = MAX_STARS * timeFactor

    const [stars, setStars] = useState(() => Array.from({length:MAX_STARS}, (_, i) => generateStar(i))); //NOTE ID assigned to clouds is index + 1, not index

    return (
        <div>
            {timeFactor}
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" >
                {stars.map((star, index) => 
                    <Star 
                        key = {index}
                        star = {star}
                        visible = {index < visibleStars}
                    />
                )}
            </svg>
        </div>
    );
}