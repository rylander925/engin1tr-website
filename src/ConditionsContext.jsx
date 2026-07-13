import { createContext, useContext, useReducer, useState } from 'react';

const HEAVY_RAIN = 10; //10mm of rain per hour
const HEAVY_WIND = 50; //50km per hour

const initialConditions = {
    elapsedTime: 0,       //Set default to another value to pregenerate grass
    isHovering: false,
    seed: 1,              //PRNG is seeded; this can be any number, determines plant generation
    speed: 10,           //Factor to speed up time speed 1 -> 1s real = 1s simulated
    weather: { 
        zipcode: 0,
        precipitation: 0, //fraction: 1=heavy, 0=none (>1 = extreme)
        windSpeed: 1,     //fraction: ^
        cloudCover: 0.5,    //fraction: ^
        date: '',         //YYYY-MM-DD
        hour: 0           //Decimal number: 12:30PM would be represented as 12.5
    }
};

const ConditionsContext = createContext(null);

const ConditionsDispatchContext = createContext(null);


export function ConditionsProvider({children}) {
    const [conditions, dispatch] = useReducer(
        conditionsReducer,
        initialConditions
    );
    
    return (
        <ConditionsContext value={conditions}>
            <ConditionsDispatchContext value={dispatch}>
                {children}
            </ConditionsDispatchContext>
        </ConditionsContext>
    );
}

export function useConditions() {
    return useContext(ConditionsContext);
}

export function useConditionsDispatch() {
    return useContext(ConditionsDispatchContext);
}

function conditionsReducer(conditions, action) {
    switch (action.type) {
        case 'increment-time': {
            return {...conditions, elapsedTime: conditions.elapsedTime + 1};
        }
        case 'set-hovering': {
            return {...conditions, isHovering: true}
        }
        case 'unset-hovering': {
            return {...conditions, isHovering: false}
        }
        case 'update-weather': {
            console.log(JSON.stringify(conditions.weather))
            const [date, timeString] = action.weather.time.split('T')
            let [hour, minute] = timeString.split(':')
            hour = Number(hour) + Number(minute)/60
            return {...conditions, 
                weather: {
                    precipitation: action.weather.precipitation/HEAVY_RAIN,
                    windSpeed: action.weather.wind_speed_10m/HEAVY_WIND,
                    cloudCover: action.weather.cloud_cover/100,
                    date: date,
                    hour: hour
                }
            };
        }
        default: {
            throw new Error("ConditionsDispatch action type does not match handled actions");
        }
    }
}