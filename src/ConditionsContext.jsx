import { createContext, useContext, useReducer, useState } from 'react';

const initialConditions = {
    elapsedTime: 0,
    isHovering: false,
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
    }
}