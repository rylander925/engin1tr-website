import { createContext, useContext, useReducer } from 'react'

const GardenContext = createContext(null);
const GardenDispatchContext = createContext(null);

const initialGarden = {
    elapsedTime: 0,
    isHovering: false,
    speed: 1,           //Factor to speed up growth speed 1 -> 1s real = 1s simulated
}

export function GardenContextProvider({children}) {
    const [garden, gardenDispatch] = useReducer(gardenReducer, initialGarden);

    return(
    <GardenContext value={garden}>
        <GardenDispatchContext value={gardenDispatch}>
            {children}
        </GardenDispatchContext>
    </GardenContext>
    );
} 

export function useGarden() {
    return useContext(GardenContext);
}

export function useGardenDispatch() {
    return useContext(GardenDispatchContext);
}

function gardenReducer(garden, action) {
    switch(action.type) {
        case('increment-time'): {
            return {...garden, elapsedTime: garden.elapsedTime + 1};
        }
        case('set-time'): {
            return {...garden, elapsedTime: action.elapsedTime};
        }
        case 'set-hovering': {
            return {...garden, isHovering: true}
        }
        case 'unset-hovering': {
            return {...garden, isHovering: false}
        }
        case('set-speed'): {
            return {...garden, speed: action.speed};
        }
        default: {
            throw Error("Garden reducer passed a dispatch action that does not match existing cases");
        }
    }
}