import React, { useReducer, createContext, useContext, ReactNode } from 'react';
import { actionTypes } from '@/constant';
import { UserType } from './interface';

const { 
    SET_USERINFO,
    SET_OPEN_LOGIN_MODAL
} = actionTypes;

interface ActionType {
    type: string;
    [key: string]: any;
};

interface ProviderProps {
    children: ReactNode;
};

interface StateType {
    userInfo?: UserType | null;
    openLoginModal?: boolean;
};

const initValue: StateType = {
    userInfo: null,
    openLoginModal: false
};

const reducer = (state: any, action: ActionType) => {
    switch (action.type) {
        case SET_USERINFO:
            return { ...state, userInfo: action.userInfo };
        case SET_OPEN_LOGIN_MODAL:
            return {...state, openLoginModal: action.openLoginModal };
        default:
            return state;
    }
};

const Context = createContext<{state: typeof initValue; dispatch: React.Dispatch<ActionType>} | undefined>(undefined);

const useGlobalContext = () => useContext(Context) || { state: initValue, dispatch: () => {} };

const Provider: React.FC<ProviderProps> = ({ children }) => {
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