import { createContext, useContext, useReducer, useState } from 'react';

const HEAVY_RAIN = 10; //10mm of rain per hour
const HEAVY_WIND = 50; //50km per hour

const initialConditions = {
    seed: 1,              //PRNG is seeded; this can be any number, determines plant generation
    weather: { 
        zipcode: 0,
        precipitation: 0, //fraction: 1=heavy, 0=none (>1 = extreme)
        windSpeed: 0.5,     //fraction: ^
        cloudCover: 0.5,    //fraction: ^
        hour: 0           //Decimal number: 12:30PM would be represented as 12.5
    },
    autoUpdateClock: true,   //If false, hour will not automatically update
    locationName: "",
    zipCode: "",
    volume: 0.2
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
        case 'update-weather': {
            const [date, timeString] = action.weather.time.split('T')
            let [hour, minute] = timeString.split(':')
            hour = Number(hour) + Number(minute)/60
            return {...conditions, 
                weather: {
                    precipitation: action.weather.precipitation/HEAVY_RAIN,
                    windSpeed: action.weather.wind_speed_10m/HEAVY_WIND,
                    cloudCover: action.weather.cloud_cover/100,
                    hour: hour
                }
            };
        }

        //Dispatched when manually setting a weather attribute. Dispatched by WeatherUI.jsx
        case 'update-weather-field': {
            return {...conditions,
                autoUpdateClock: (action.field === 'hour' ? false : conditions.autoUpdateClock), //Stops auto update clock if manually changed
                weather: {
                    ...conditions.weather,
                    [action.field]: action.value
                }
            };
        }
        case 'update-volume': {
            return {...conditions, volume: action.volume}
        }
        case 'set-seed': {
            return {...conditions, 
                seed: action.seed,
            }
        }
        case 'update-locationName': {
            return {...conditions, locationName: action.locationName}
        }
        case 'update-zipCode': {
            return {...conditions, zipCode: action.zipCode}
        }
        //Updates the current date and hour using local time
        //Dispatched by Clock.jsx
        case 'update-now': {
            if(conditions.autoUpdateClock) {
                const now = new Date();
                const hour = now.getHours();
                return {...conditions, weather: {...conditions.weather, hour: hour} };
            }
            return {...conditions};
        }

        case 'toggle-autoUpdateClock': {
            if(conditions.autoUpdateClock) {
                return {...conditions, autoUpdateClock: false};
            }
            return {...conditions, autoUpdateClock: true};
        }
        default: {
            throw new Error("ConditionsDispatch action type does not match handled actions");
        }
    }
}