import { createContext, useContext, useDispatch } from 'react'

const ElapsedTimeContext = createContext(null);
const ElapsedTimeDispatchContext = createContext(null);

const initialTime = 0

export function ElapsedTimeContextProvider({children}) {
    const [elapsedTime, elapsedTimeDispatch] = useDispatch(elapsedTimeReducer, initialTime);

    return(
    <ElapsedTimeContext value={elapsedTime}>
        <ElapsedTimeDispatchContext value={elapsedTimeDispatch}>
            {children}
        </ElapsedTimeDispatchContext>
    </ElapsedTimeContext>
    );
} 

export function useElapsedTime() {
    return useContext(ElapsedTimeContext);
}

export function useElapsedTimeDispatch() {
    return useContext(ElapsedTimeDispatchContext);
}

function elapsedTimeReducer(elapsedTime, action) {
    switch(action.type) {
        case('increment-time'): {
            return 
        }
    }
}