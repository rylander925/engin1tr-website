import { useState, useEffect, useMemo } from 'react'
import grassImg from '../../../assets/grass.png'
import grass1 from '../../../assets/plants/grass1.svg'
import grass2 from '../../../assets/plants/grass2.svg'
import grass3 from '../../../assets/plants/grass3.svg'
import grass4 from '../../../assets/plants/grass4.svg'
import Grass from './Grass'
import './Garden.css'
import { useConditions } from '../../../ConditionsContext'
const images = import.meta.glob('../../../assets/plants/*.svg')

const VARIANTS = [grass1, grass2, grass3, grass4]

//Plant gen controls
const BASE_INTERVAL = 1        //generate blade every 10 seconds
const SLOWDOWN_FACTOR = 2     //larger factor slows down growth as # of blades increases
const SPREAD_RATE = 2       // Determines how x pos spread of plants changes with # of plants
const HEIGHT_AVERAGE = 150  // Average plant height
const HEIGHT_RANGE = 150     // Total plant height range around average
const LEAN_RANGE = 30       // Range of plant rotation in degrees (around vertical)
const HUE_SHIFT_RANGE = 40  // Range in hue shift about unchanged image 

//Animation controls
const GROW_DURATION = 5        // seconds -- how long the entrance animation takes
const SWAY_DURATION_BASE = 3   // seconds -- fastest possible sway cycle
const SWAY_DURATION_RANGE = 10  // seconds -- spread added on top of the base, per blade
const SWAY_DELAY_RANGE = 20       // seconds -- randomizes phase so blades don't sync up

const GUST_INTERVAL = 10000 // ms between automatic wind gusts
const GUST_DURATION = 5000   // ms the gust class stays applied

//TODO: Add support for different plant types

//Random number seeder. Well-documented---search 'mulberry32' for details
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  };
}
// Returns a seeded RNG for indexed random numbers. RNG returns float between 0 and 1
// 9781 is a largish odd number to differentiate seeds between array members
const rngForIndex = (seed, i) => mulberry32(seed + i * 9781)

//Return the elapsed time at which nth plant appears
function timeForIndex(n) {
    return n * BASE_INTERVAL + SLOWDOWN_FACTOR * (n ** 2)
}

//Return the number of plants (called index for consistency) at a given elapsed time
function indexForTime(elapsedTime) {
    const a = SLOWDOWN_FACTOR, b = BASE_INTERVAL, c = -elapsedTime;
    const solution = (-b + Math.sqrt(b**2 - 4*a*c)) / (2*a)
    return Math.max(0, Math.floor(solution))
}

console.log("Time", timeForIndex(2), "Index", (indexForTime(timeForIndex(1))));

//generate blade data
    //TODO: Add support for different plant types e.g. type prop
function generateBlade(seed, index) {
    index = index + 1   //start at one for index instead of 0
    const rand = rngForIndex(seed, index);
    return {
        id: index,
        appearTime: timeForIndex(index),
        src: VARIANTS[Math.floor(rand() * VARIANTS.length)],

        //% range about center governed by index * SPREAD_RATE
        x: 50 + (rand() - 0.5) * Math.min(index * SPREAD_RATE, 100), 

        height: HEIGHT_AVERAGE + (rand() - 0.5) * HEIGHT_RANGE,
        flip: rand() < 0.5,
        lean: (rand() - 0.5) * LEAN_RANGE,
        hue: (rand() - 0.5) * HUE_SHIFT_RANGE,

        //AI-ZONE: per-blade sway timing
        //FIXME: Sway twitching
        swayDuration: SWAY_DURATION_BASE + rand() * SWAY_DURATION_RANGE,
        swayDelay: rand() * SWAY_DELAY_RANGE,
    }
}

//generate full garden at elapsedTime
function gardenAt(elapsedTime, seed = 1) {
    const count = indexForTime(elapsedTime)
    return Array.from({ length:count }, (_, i) => generateBlade(seed, i))
}

//update blade data every second

//Take blade data to make a blade div
    //TODO: Add support for different plant types (not grass)
    //AI-ZONE: Review animation code
    //FIXME: Sway twitching
function Plant( {plant, index} ) {
    const conditions = useConditions();
    const age = conditions.elapsedTime - plant.appearTime;
    const stillGrowing = age < GROW_DURATION * conditions.speed;
    return(
        //Position wrapper
        <div className='plant'
            style = {{
                    left: `${plant.x}%`,
                    bottom: '0%',
                    position: 'absolute'
            }}
        >
            <div //AI-ZONE: sway animations
                className = "plant-sway"
                style = {{
                    transformOrigin: 'bottom center',
                    animation: `sway ${plant.swayDuration}s 
                                ease-in-out ${plant.swayDelay}s infinite`,
                }}
            >
                <img
                    src = {plant.src}
                    style = {{
                        height: plant.height,
                        display: 'block',
        
                        transformOrigin: 'bottom center',
                        transform: `scaleX(${plant.flip ? -1 : 1}) 
                                    rotate(${plant.lean}deg)`,
                        filter: `hue-rotate(${plant.hue}deg)`,

                         //AI-ZONE: Growth animation
                        // Growth: clip-path doesn't touch `transform`, so it layers on
                        // top of the flip/lean above with no conflict. Older blades
                        // (already fully grown) skip the animation entirely and just
                        // render revealed -- no replaying growth on every reload.
                        clipPath: stillGrowing ? undefined : 'inset(0% 0 0 0)',
                        animation: stillGrowing ?
                             `growReveal ${GROW_DURATION/conditions.speed}s ease-out ${1}s both`
                             : undefined,
                    }}
                />
            </div>
        </div>
    )
}
//Make garden div
    //FIXME: Get gust functionality to work properly
export default function Garden() {
    const conditions = useConditions();
    const plants = useMemo(
        () => gardenAt(conditions.elapsedTime, conditions.seed), 
        [conditions.elapsedTime, conditions.seed]
    );
    
    // AI-ZONE
    // Periodic wind gust: toggling one class on the container lets the CSS
    // (see .garden.gusting .blade-sway in Garden.css) override every blade's
    // sway animation at once, instead of touching each blade in JS.
    const [gusting, setGusting] = useState(false)
    useEffect(() => {
        const interval = setInterval(() => {
                setGusting(true);
                setTimeout(() => setGusting(false), GUST_DURATION);
            }, GUST_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`garden${gusting ? '-gusting' : ''}`}
            style={{position: 'relative'}}
        >  
            {plants.map((plant, index) => 
                <Plant 
                    key = {index} 
                    plant={plant} 
                    index={index}     
                />
            )}
            <Grass />
        </div>
    );
}