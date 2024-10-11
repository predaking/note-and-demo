import React, { useReducer, createContext } from 'react';

interface ActionType {
    type: string;
    [key: string]: any;
}

const initValue = {
    userInfo: {}
};

const reducer = (state: any, action: ActionType) => {
    switch (action.type) {
        case 'setUserInfo':
            return { ...state, userInfo: action.userInfo };
        default:
            return state;
    }
};

const Provider = ({ children }: { children: any }) => {
    const [state, dispatch] = useReducer(reducer, initValue);

    const Context = createContext(state);

    return (
        <Context.Provider
            value={{
                state,
                dispatch
            }}
        >
            {children}
        </Context.Provider>
    );
};

export {
    state,
    dispatch,
    Provider
};