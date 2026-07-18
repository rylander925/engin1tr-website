import { useState, useEffect } from 'react'
import { useConditions } from '../../../../ConditionsContext'
import { steepHill } from '../Clouds/Clouds';
import './Stars.css'

const RADIUS_MIN = 0.05;
const RADIUS_RANGE = 0.2;
const OUTER_RADIUS_MULTIPLIER_MAX = 2.5;
const Y_RANGE = 100                 // Range in y values from top as a percent
const HUE_SHIFT_RANGE = 40          // Range in hue shift about unchanged image 
const OPACITY_RANGE = 0.3           // Range of random decrease in opacity
const OPACITY_MAX = 0.7

const MAX_STARS = 250               //Clouds when cloud cover is 100%

function Star( {star, index, visible} ) {
    return(
        <circle
            className = 'star'
            cx={star.cx}
            cy={star.cy}
            r = {star.r}
            style = {{
                fill: 'white',
                filter: `hue-rotate(${star.hue}deg)`,
                opacity: visible ? star.opacity : 0,
            }}
        >
        </circle>
    )
}

function generateStar(index) {
    const y = Math.random() * Y_RANGE;
    return {
        id: index,
        
        //Elevation dependent generation
        cx: Math.random() * 100,
        cy: y,

        //Cloud variation
        r: RADIUS_MIN + Math.random() * RADIUS_RANGE, 
        outerRadiusMultiplier:  Math.random() * OUTER_RADIUS_MULTIPLIER_MAX,
        hue: (Math.random() - 0.5) * HUE_SHIFT_RANGE,
        opacity: (OPACITY_MAX - (Math.random() * OPACITY_RANGE)) * (1-y/Y_RANGE),
    }
}

const CUTOFF_TIME = 6

export default function Stars() {
    const conditions = useConditions();

    const timeFactor = Math.max(Math.abs(12 - conditions.weather.hour) - CUTOFF_TIME, 0) / (12 - CUTOFF_TIME);

    const visibleStars = MAX_STARS * steepHill(timeFactor, 5)

    const [stars, setStars] = useState(() => Array.from({length:MAX_STARS}, (_, i) => generateStar(i))); //NOTE ID assigned to clouds is index + 1, not index

    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width='100vw' height='100vh'>
            {stars.map((star, index) => 
                <Star 
                    key = {index}
                    star = {star}
                    visible = {index < visibleStars}
                />
            )}
        </svg>
    );
}