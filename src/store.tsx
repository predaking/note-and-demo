import React, { useReducer, createContext, useContext, ReactNode } from 'react';
import { actionTypes } from '@/constant';

const { SET_USERINFO } = actionTypes;

interface ActionType {
    type: string;
    [key: string]: any;
};

interface ProviderProps {
    children: ReactNode;
};

const initValue = {
    userInfo: null
};

const reducer = (state: any, action: ActionType) => {
    switch (action.type) {
        case SET_USERINFO:
            return { ...state, userInfo: action.userInfo };
        default:
            return state;
    }
};

const Context = createContext<{state: typeof initValue; dispatch: React.Dispatch<ActionType>} | undefined>(undefined);

const useGlobalContext = () => useContext(Context) || { state: initValue, dispatch: () => {} };

const Provider: React.FC<ProviderProps> = ({ children } : { children: any }) => {
    const [state, dispatch] = useReducer(reducer, initValue);

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
    useGlobalContext,
    Provider
};