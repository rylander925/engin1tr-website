import { useState, useEffect, useMemo } from 'react'
import { useGarden, useGardenDispatch } from '../../../GardenContext'
import { useConditions, useConditionsDispatch } from '../../../ConditionsContext'
import Generator from './PlantGen/Generable'
import PlantGenerator from './PlantGen/PlantGenerator'
import Plant from './PlantGen/Plant'
import Grass from './PlantGen/Grass'
import './Garden.css'

//Plant gen controls
const BASE_INTERVAL = 1             //Base interval between plant gens
const SLOWDOWN_FACTOR = 0.5         //larger factor slows down growth as # of blades increases
                                    //num = base*t + slowdown*t^2

//Gust and wind controls
const GUST_INTERVAL = 12000         // average ms between automatic wind gusts
const GUST_INTERVAL_RANGE = 8000    // ms range between gusts
const BASE_GUST_DURATION = 4000     // ms the gust class stays applied

const WIND_INTENSITY_FACTOR = 3     //Determinse range of wind speeds between wind=0 and wind = 100%
const MIN_GUST_INTENSITY = 0.5
const MIN_SWAY_INTENSITY = 1

export default function Garden() {
    //Weather and seed information
    const conditions = useConditions();
    const weather = conditions.weather
    const dispatch = useConditionsDispatch();

    //Elapsed time, hover information
    const garden = useGarden();
    const gardenDispatch = useGardenDispatch();
   
    //Create seed dependent plant generator; Regenerates all plants each seed change
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

            //Plays animation by flipping className on and off. Not best but whatever TODO: Find better way
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