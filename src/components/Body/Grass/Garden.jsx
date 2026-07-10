import { useState, useMemo } from 'react'
import grassImg from '../../../assets/grass.png'
import grass1 from '../../../assets/plants/grass1.svg'
import grass2 from '../../../assets/plants/grass2.svg'
import grass3 from '../../../assets/plants/grass3.svg'
import grass4 from '../../../assets/plants/grass4.svg'
const images = import.meta.glob('../../../assets/plants/*.svg')

const BASE_INTERVAL = 50        //generate blade every 10 seconds
const SLOWDOWN_FACTOR = 0.1     //larger factor slows down growth as # of blades increases

const VARIANT_NAMES = ['grass1', 'grass2', 'grass3', 'grass4']

const VARIANTS = [grass1, grass2, grass3, grass4]

const SPREAD_RATE = 1       // Determines how x pos spread of plants changes with # of plants
const HEIGHT_AVERAGE = 150  // Average plant height
const HEIGHT_RANGE = 150     // Total plant height range around average
const LEAN_RANGE = 30       // Range of plant rotation in degrees (around vertical)
const HUE_SHIFT_RANGE = 40  // Range in hue shift about unchanged image 

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

//generate blade data
    //TODO: Add support for different plant types e.g. type prop
    //TODO: Add support for varied animation e.g. swayDuration prop
function generateBlade(seed, index) {
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
        hue: (rand() - 0.5) * HUE_SHIFT_RANGE
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
    //TODO: Add animation support
function Plant( {plant, index} ) {
    const elapsedTime = timeForIndex(index)
    const age = elapsedTime - plant.appearTime
    //TODO: Add animation support; const stillGrowing = age < GROW_DURATION
    return(
        <img
            src = {plant.src}
            style = {{
                height: plant.height,
                left: `${plant.x}%`,
                position: 'absolute',
                transform: `scaleX(${plant.flip ? -1 : 1}) 
                            rotate(${plant.lean}deg)`,
                filter: `hue-rotate(${plant.hue}deg)`,
                transformOrigin: 'bottom center'
            }}
        />
    )
}
//Make garden div
export default function Garden({ onHoverChange, hoverTime, seed = 1 }) {
    const plants = useMemo(() => gardenAt(hoverTime, seed), [hoverTime, seed])
    return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
    {plants.map((plant, index) => <Plant key = {index} plant={plant} index={index}/>)}
    </div>
  )
}