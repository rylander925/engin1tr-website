import { useState, useEffect, useMemo } from 'react'
import grassImg from '../../../assets/grass.png'
import grass1 from '../../../assets/plants/grass1.svg'
import grass2 from '../../../assets/plants/grass2.svg'
import grass3 from '../../../assets/plants/grass3.svg'
import grass4 from '../../../assets/plants/grass4.svg'
import { Generator } from './Generable' 
import './Garden.css'
import { useGarden, useGardenDispatch } from '../../../GardenContext'
import { useConditions, useConditionsDispatch } from '../../../ConditionsContext'

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

const GUST_INTERVAL = 10000         // average ms between automatic wind gusts
const GUST_INTERVAL_RANGE = 6000
const BASE_GUST_DURATION = 4000          // ms the gust class stays applied

const WIND_INTENSITY_FACTOR = 3     //Determins range of wind speeds between wind=0 and wind = 100%
const MIN_GUST_INTENSITY = 0.5
const MIN_SWAY_INTENSITY = 1

//TODO: Add support for different plant types
const PLANT_TYPE_WEIGHTS = {'grass': 5}


class Plant {
    static className = 'plant';
    static gustClassName = 'plant-gust';
    static swayClassName = 'plant-sway';
    static positionWrapperClassName = 'plant-bounding-box';

    static variants = []; //override by child class

    static spreadRate = 2;
    static heightAverage = 150;
    static heightRange = 150;
    static leanRange = 30;
    static hueShiftRange = 40;
    
    static growDuration = 10;
    static swayDurationBase = 3;
    static swayDurationRange = 10;
    static swayDelayRange = 3;
    static gustPositionDelayFactor = 0.7;

    id = -1;
    appearTime = -1;
    src = '';
    x = -1;
    y = 0;
    height = -1;
    flipped = 0;
    lean = 0;
    hue = 0;
    gustDelay = 0;
    swayDuration = 0;
    swayDelay = 0;

    //Source must be set in child class constructor
    constructor(rand, index, appearTime) {
        this.id = index;
        this.appearTime = appearTime;
        this.src = this.constructor.variants[Math.floor(rand() * this.constructor.variants.length)];

        this.x = 50 + (rand() - 0.5) * Math.min(index * this.constructor.spreadRate, 100);               //X is assumed to be a percent viewport width
        this.y = 0;
        this.height = this.constructor.heightAverage + (rand() - 0.5) * this.constructor.heightRange;
        //Width is based on height

        this.flipped = rand() < 0.5;
        this.lean = (rand() - 0.5) * this.constructor.leanRange;
        this.hue = (rand() - 0.5) * this.constructor.hueShiftRange;

        this.gustDelay = this.constructor.gustPositionDelayFactor * this.x/100;
        
        this.swayDuration = this.constructor.swayDurationBase + rand() * this.constructor.swayDurationRange;
        this.swayDelay = rand() * this.constructor.swayDelayRange;
    }

    //By default does not take children.
    Plant = () => {
        const garden = useGarden();

        //Keep track of age to determine whether to play growth animation
        const age = garden.elapsedTime - this.appearTime;
        const stillGrowing = age < this.constructor.growDuration * garden.speed;

        return(
            <this.PlantPositionWrapper>
                <this.PlantAnimation>
                    <img
                        className = {this.constructor.className}
                        src = {this.src}
                        style = {{
                            transformOrigin: 'bottom center',
                            display: 'block',
                            
                            height: this.height,
                            transform: `scaleX(${this.flipped ? -1 : 1}) 
                                        rotate(${this.lean}deg)`,
                            filter: `hue-rotate(${this.hue}deg)`,

                            //Growth animation
                            //if elapsedTime is set past age, don't show animation
                            
                            clipPath: stillGrowing ? undefined : 'inset(0% 0 0 0)',
                            animation: stillGrowing ?
                                `growReveal ${this.constructor.growDuration/garden.speed}s ease-in-out 0s both`
                                : undefined,
                        }}
                    />
                </this.PlantAnimation>
            </this.PlantPositionWrapper>
        )
    }

    PlantPositionWrapper = ({children}) => {
        const gardenDispatch = useGardenDispatch();
        return(
            <div
                className = {this.constructor.positionWrapperClassName} //Set outline visible in css to show hitbox
                onMouseEnter={() => gardenDispatch({type:'set-hovering'})}
                onMouseLeave={() => gardenDispatch({type:'unset-hovering'})}
                style = {{
                        left: `${this.x}%`,
                        bottom: `${this.y}%`,
                        position: 'absolute'
                }}
            >
                {children}
            </div>
        );
    }

    PlantAnimation = ({children}) => {
        return (
            <this.GustAnimation>
                <this.SwayAnimation>
                    {children}
                </this.SwayAnimation>
            </this.GustAnimation>
        );
    }

    GustAnimation = ({children}) => {
        return(
            <div
                className = {this.constructor.gustClassName}
                style = {{ 
                    '--gust-delay': `${this.gustDelay}s`,
                    transformOrigin: 'bottom center',
                }}
            >
                {children}
            </div>
        )
    }

    SwayAnimation = ({children}) => {
        return (
            <div
                className = {this.constructor.swayClassName}
                style = {{
                    '--sway-duration': `${this.swayDuration}s`,
                    '--sway-delay': `${this.swayDelay}s`,
                    transformOrigin: 'bottom center',
                }}
            >
                {children}
            </div>
        )   
    }
}

class Grass extends Plant {
    static variants = [grass1, grass2, grass3, grass4];
}

//
class PlantGenerator extends Generator {
    constructor( baseInterval, slowdownFactor, seed ) {
        super(baseInterval, slowdownFactor, seed);
    }

    /*Returns a plant object
        TODO: Add support to randomly select between different plant types
    */
    generateItemAttributes(rand, index) {
        const plant = new Grass(rand, index, this.timeForIndex(index));
        return(plant);
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
   
    const plantGenerator = useMemo(
        () => new PlantGenerator(BASE_INTERVAL, SLOWDOWN_FACTOR, conditions.seed),
        [conditions.seed]
    );
    const plants = plantGenerator.useGenerableAtTime(garden.elapsedTime);
    
    const [defaultGrass] = useState(new Grass(Math.random, 0, 0));

    const gustIntensity = MIN_GUST_INTENSITY + weather.windSpeed * WIND_INTENSITY_FACTOR
    const swayIntensity = MIN_SWAY_INTENSITY + weather.windSpeed * WIND_INTENSITY_FACTOR
    const [gustVariation, setGustVariation] = useState(0.5)

    //Increment elapsed time on hover.
    //Time is based on speed.
    useEffect(() => {
        if(!garden.isHovering) { return }
        const intervalId = setInterval(() => {gardenDispatch({ type: 'increment-time' })}, 1000 / garden.speed)
        return () => clearInterval(intervalId)
    }, [garden.isHovering, garden.speed])
    
    
    // Periodic wind gust
    const [gusting, setGusting] = useState(false)
    useEffect(() => {
        let gustTimeout;
        const scheduleGust = () => {
            setGustVariation(Math.random())
            const gustInterval = BASE_GUST_DURATION + (GUST_INTERVAL + GUST_INTERVAL_RANGE * (Math.random() - 0.5))/gustIntensity;
            gustTimeout = setTimeout(() => {
                setGusting(false);
                setTimeout(() => setGusting(true), 250); //Multiply by 2 to allow plants growing mid gust to blow. Not a complete fix
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
            {plants.map((plant, index) => <plant.Plant key = {index}/>)}
            <defaultGrass.Plant
                key = '-1'
            />
        </div>
    );
}