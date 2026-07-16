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
import { Plant } from './Plant'

//Plant gen controls
const BASE_INTERVAL = 1         //Base interval between plant gens
const SLOWDOWN_FACTOR = 0.5     //larger factor slows down growth as # of blades increases
                                //num = base*t + slowdown*t^2

//Gust and wind controls
const GUST_INTERVAL = 12000         // average ms between automatic wind gusts
const GUST_INTERVAL_RANGE = 8000    // ms range between gusts
const BASE_GUST_DURATION = 4000     // ms the gust class stays applied

const WIND_INTENSITY_FACTOR = 3     //Determinse range of wind speeds between wind=0 and wind = 100%
const MIN_GUST_INTENSITY = 0.5
const MIN_SWAY_INTENSITY = 1

//TODO: Add support for different plant types
const PLANT_TYPE_WEIGHTS = {'grass': 5}

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