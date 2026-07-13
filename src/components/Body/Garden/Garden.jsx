import { useState, useEffect } from 'react'
import grassImg from '../../../assets/grass.png'
import grass1 from '../../../assets/plants/grass1.svg'
import grass2 from '../../../assets/plants/grass2.svg'
import grass3 from '../../../assets/plants/grass3.svg'
import grass4 from '../../../assets/plants/grass4.svg'
import Grass from './Grass'
import { Generator } from './Generable' 
import './Garden.css'
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

const GUST_INTERVAL = 10000 // ms between automatic wind gusts
const GUST_DURATION = 4000   // ms the gust class stays applied

//TODO: Add support for different plant types

class PlantGenerator extends Generator {
    constructor( baseInterval, slowdownFactor, seed ) {
        super(baseInterval, slowdownFactor, seed);
    }

    generateItemAttributes(rand, index) {
        return {
            id: index,
            appearTime: this.timeForIndex(index),
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

    static PlantAnimation( {plant, children} ) {
        return(
            <div
                className = 'plant-gust'
                style = {{ transformOrigin: 'bottom center'}}
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

    static Plant( {plant, index} ) {
        const conditions = useConditions();
        const dispatch = useConditionsDispatch();
        const age = conditions.elapsedTime - plant.appearTime;
        const stillGrowing = age < GROW_DURATION * conditions.speed;
        return(
            //Position wrapper
            <div
                className = 'plant-bounding-box' //Set outline visible in css to show hitbox
                onMouseEnter={() => dispatch({type:'set-hovering'})}
                onMouseLeave={() => dispatch({type:'unset-hovering'})}
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

                                //AI-ZONE: Growth animation
                                // Growth: clip-path doesn't touch `transform`, so it layers on
                                // top of the flip/lean above with no conflict. Older blades
                                // (already fully grown) skip the animation entirely and just
                                // render revealed -- no replaying growth on every reload.
                                clipPath: stillGrowing ? undefined : 'inset(0% 0 0 0)',
                                animation: stillGrowing ?
                                    `growReveal ${GROW_DURATION/conditions.speed}s ease-in-out 0s both`
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
    const dispatch = useConditionsDispatch();
    const plantGenerator = new PlantGenerator(BASE_INTERVAL, SLOWDOWN_FACTOR, conditions.seed);
    const plants = plantGenerator.useGenerableAtTime(conditions.elapsedTime);
    
    // AI-ZONE
    // Periodic wind gust: toggling one class on the container lets the CSS
    // (see .garden.gusting .blade-sway in Garden.css) override every blade's
    // sway animation at once, instead of touching each blade in JS.
    const [gusting, setGusting] = useState(false)
    useEffect(() => {
        const interval = setInterval(() => {
                setGusting(true);
                setTimeout(() => setGusting(false), GUST_DURATION * 2); //Multiply by 2 to allow plants growing mid gust to blow. Not a complete fix
            }, GUST_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`garden${gusting ? '-gusting' : ''}`}
            style={{
                '--gust-duration': `${GUST_DURATION}ms`
            }}
        >  
            {plants.map((plant, index) => 
                <PlantGenerator.Plant
                    key = {index} 
                    plant={plant} 
                    index={index} 
                />
            )}
            <Grass />
        </div>
    );
}