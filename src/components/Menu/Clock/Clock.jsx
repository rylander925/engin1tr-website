import { useEffect, useState } from 'react'
import { useConditions, useConditionsDispatch } from '../../../ConditionsContext';
import './Clock.css'

const HOUR_UPDATE_FREQUENCY = 60;      //Checks if hour changed and updates lock every this many SECONDS
const CLOCK_UPDATE_FREQUENCY = 1;      //Update frequency of displayed clock in SECONDS

export default function Clock() {
    const dispatch = useConditionsDispatch();
    const { weather, autoUpdateClock } = useConditions();
    const [now, setNow] = useState(() => new Date()); 
    
    //Updates the hour function every hour
    //Will override manual setting
    useEffect(() => {
        const checkHour = () => {
            if(!autoUpdateClock) return;
            
            if (weather.hour !== now.getHours) {
                dispatch({type:'update-now'});
            }
        };
        checkHour();
        
        const timer = setInterval(checkHour, HOUR_UPDATE_FREQUENCY * 1000);
        return () => clearInterval(timer);
    }, []);
    
    //Timer updates every second
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), CLOCK_UPDATE_FREQUENCY * 1000);
        return () => clearInterval(timer);
    }, []);


    return(
        <div className='clock' id='screen-text'>
            {now.toLocaleString([], {year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit'})}
        </div>
    )
}