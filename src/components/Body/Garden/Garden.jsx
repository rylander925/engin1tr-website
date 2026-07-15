import { useState, useEffect } from 'react'
import grassImg from '../../../assets/grass.png'
import grass1 from '../../../assets/plants/grass1.svg'
import grass2 from '../../../assets/plants/grass2.svg'
import grass3 from '../../../assets/plants/grass3.svg'
import grass4 from '../../../assets/plants/grass4.svg'
import { Generator } from './Generable' 
import './Garden.css'
import { useGarden, useGardenDispatch } from '../../../GardenContext'
import { useConditions, useConditionsDispatch } from '../../../ConditionsContext'

const VARIANTS = [grass1, grass2, grass3, grass4]

//Plant gen controls
const BASE_INTERVAL = 1        //generate blade every 10 seconds
const SLOWDOWN_FACTOR = 0.5     //larger factor slows down growth as # of blades increases
const SPREAD_RATE = 2       // Determines how x pos spread of plants changes with # of plants
const HEIGHT_AVERAGE = 150  // Average plant height
const HEIGHT_RANGE = 150     // Total plant height range around average
const LEAN_RANGE = 30       // Range of plant rotation in degrees (around vertical)
const HUE_SHIFT_RANGE = 40  // Range in hue shift about unchanged image 

//Animation controls
const GROW_DURATION = 10        // seconds -- how long the entrance animation takes
const SWAY_DURATION_BASE = 3   // seconds -- fastest possible sway cycle
const SWAY_DURATION_RANGE = 10  // seconds -- spread added on top of the base, per blade
const SWAY_DELAY_RANGE = 20       // seconds -- randomizes phase so blades don't sync up

const GUST_INTERVAL = 7000         // average ms between automatic wind gusts
const GUST_INTERVAL_RANGE = 6000
const BASE_GUST_DURATION = 4000          // ms the gust class stays applied

const WIND_INTENSITY_FACTOR = 3     //Determins range of wind speeds between wind=0 and wind = 100%
const MIN_GUST_INTENSITY = 0.5
const MIN_SWAY_INTENSITY = 1

//TODO: Add support for different plant types

//
class PlantGenerator extends Generator {
    constructor( baseInterval, slowdownFactor, seed ) {
        super(baseInterval, slowdownFactor, seed);
    }

    /*Returns a map of attributes
        id:             Holds current index
        appearTime:     Theoretical (which should be the actual) time plant spawns. Used to calculate plant age.
        x:              Position from the left. Range is restricted around center based on number of grass blades and spread rate.
        height:         Plant height
        flip:           L/R orientation of plant
        lean:           Tilt of plant
        hue:            Slight hue shift from default green

        gustDelay:      Plants to the right of the screen will be blown slightly later when a gust happens

        swayDuration:   Determines duration (and therefore speed) of random plant sways
        swayDelay:      Determines the frequency of random plant sways.
    */
    generateItemAttributes(rand, index) {
        const x = 50 + (rand() - 0.5) * Math.min(index * SPREAD_RATE, 100); 
        return {
            id: index,
            appearTime: this.timeForIndex(index),
            src: VARIANTS[Math.floor(rand() * VARIANTS.length)],

            x: x, 
            height: HEIGHT_AVERAGE + (rand() - 0.5) * HEIGHT_RANGE,
            flip: rand() < 0.5,
            lean: (rand() - 0.5) * LEAN_RANGE,
            hue: (rand() - 0.5) * HUE_SHIFT_RANGE,

            gustDelay: 0.7 * x/100,

            swayDuration: SWAY_DURATION_BASE + rand() * SWAY_DURATION_RANGE,
            swayDelay: rand() * SWAY_DELAY_RANGE,
        }
    }

    //Wrapper div so plant animations can trigger independently (and stack upon) eachother and existing transformations to the plant.
    static PlantAnimation( {plant, children} ) {
        return(
            <div
                className = 'plant-gust'
                style = {{ transformOrigin: 'bottom center',
                            '--gust-delay': `${plant.gustDelay}s`
                }}
                >
                    <div
                        className = 'plant-sway'
                        style = {{
                            transformOrigin: 'bottom center',
                            '--sway-duration': `${plant.swayDuration}s`,
                            '--sway-delay': `${plant.swayDelay}s`,
                        }}
                        >
                        {children}
                    </div>
            </div>
        )
    }

    //Create a plant div
    //TODO: Maybe move speed to garden context
    static Plant( {plant, index} ) {
        const garden = useGarden();
        const gardenDispatch = useGardenDispatch();
        const age = garden.elapsedTime - plant.appearTime;
        const stillGrowing = age < GROW_DURATION * garden.speed;
        return(
            //Position wrapper so hover bounding box is static
            <div
                className = 'plant-bounding-box' //Set outline visible in css to show hitbox
                onMouseEnter={() => gardenDispatch({type:'set-hovering'})}
                onMouseLeave={() => gardenDispatch({type:'unset-hovering'})}
                style = {{
                        left: `${plant.x}%`,
                        bottom: '0%',
                        position: 'absolute'
                }}
                >
                <PlantGenerator.PlantAnimation plant = {plant}>
                        <img
                            className = 'plant'
                            src = {plant.src}
                            style = {{
                                height: plant.height,
                                display: 'block',
                                
                                transformOrigin: 'bottom center',
                                transform: `scaleX(${plant.flip ? -1 : 1}) 
                                            rotate(${plant.lean}deg)`,
                                filter: `hue-rotate(${plant.hue}deg)`,

                                //Growth animation
                                //if elapsedTime is set past age, don't show animation
                                clipPath: stillGrowing ? undefined : 'inset(0% 0 0 0)',
                                animation: stillGrowing ?
                                    `growReveal ${GROW_DURATION/garden.speed}s ease-in-out 0s both`
                                    : undefined,
                            }}
                        />
                </PlantGenerator.PlantAnimation>
            </div>
        )
    }
}

//Make garden div
    //FIXME: Get gust functionality to work properly
export default function Garden() {
    const conditions = useConditions();
    const weather = conditions.weather
    const dispatch = useConditionsDispatch();

    const garden = useGarden();
    const gardenDispatch = useGardenDispatch();
   
    const plantGenerator = new PlantGenerator(BASE_INTERVAL, SLOWDOWN_FACTOR, conditions.seed);
    const plants = plantGenerator.useGenerableAtTime(garden.elapsedTime);

    const gustIntensity = MIN_GUST_INTENSITY + weather.windSpeed * WIND_INTENSITY_FACTOR
    const swayIntensity = MIN_SWAY_INTENSITY + weather.windSpeed * WIND_INTENSITY_FACTOR
    const [gustVariation, setGustVariation] = useState(0.5)

    //Increment elapsed time on hover.
    //Time is based on speed.
    useEffect(() => {
        if(!garden.isHovering) { return }
        const intervalId = setInterval(() => {gardenDispatch({ type: 'increment-time' })}, 1000 / garden.speed)
        return () => clearInterval(intervalId)
    }, [garden.isHovering])
    
    // Periodic wind gust
    const [gusting, setGusting] = useState(false)
    useEffect(() => {
        let gustTimeout;
        const scheduleGust = () => {
            setGustVariation(Math.random())
            const gustInterval = BASE_GUST_DURATION * 2 + (GUST_INTERVAL + GUST_INTERVAL_RANGE * (Math.random() - 0.5))/gustIntensity;
            gustTimeout = setTimeout(() => {
                setGusting(true);
                setTimeout(() => setGusting(false), BASE_GUST_DURATION * 2); //Multiply by 2 to allow plants growing mid gust to blow. Not a complete fix
                scheduleGust();
            }, gustInterval);
        };

        scheduleGust();
        return () => clearTimeout(gustTimeout);
    }, []);

    return (
        <div
            className={`garden${gusting ? '-gusting' : ''}`}
            style={{
                '--gust-duration': `${BASE_GUST_DURATION}ms`,
                '--gust-intensity': gustIntensity * gustVariation,
                '--sway-intensity': swayIntensity,
            }}
        >  
            {plants.map((plant, index) => 
                <PlantGenerator.Plant
                    key = {index} 
                    plant={plant} 
                    index={index} 
                />
            )}
            <PlantGenerator.Plant
                key = '-1'
                plant = {plantGenerator.generateItem(-1)}
                index = {-1}
            />
        </div>
    );
}