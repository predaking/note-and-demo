import React, { useReducer, createContext, useContext, ReactNode } from 'react';
import { actionTypes } from '@/constant';
import { UserType, ResultType } from './interface';
import { get } from '@/service';

const { 
    SET_USERINFO,
    SET_OPEN_LOGIN_MODAL,
    SET_LOADING,
    SET_ERROR,
    SET_ISLOGIN
} = actionTypes;

interface ActionType {
    type: string;
    [key: string]: any;
};

interface ProviderProps {
    children: ReactNode;
};

interface StateType {
    isLogin?: boolean;
    userInfo?: UserType | null;
    openLoginModal?: boolean;
    loading?: boolean;
    error?: string | null;
};

const initValue: StateType = {
    isLogin: false,
    userInfo: null,
    openLoginModal: false,
    loading: false,
    error: null
};

const reducer = (state: any, action: ActionType) => {
    switch (action.type) {
        case SET_USERINFO:
            return { ...state, userInfo: action.userInfo, loading: false, error: null };
        case SET_OPEN_LOGIN_MODAL:
            return {...state, openLoginModal: action.openLoginModal };
        case SET_LOADING:
            return { ...state, loading: action.loading };
        case SET_ERROR:
            return { ...state, error: action.error, loading: false };
        case SET_ISLOGIN:
            return {...state, isLogin: action.isLogin };
        default:
            return state;
    }
};

const Context = createContext<{state: typeof initValue; dispatch: React.Dispatch<ActionType>} | undefined>(undefined);

const useGlobalContext = () => useContext(Context) || { state: initValue, dispatch: () => {} };

// 异步action creators
const asyncActions = {
    isLogin: async (dispatch: React.Dispatch<ActionType>) => {
        dispatch({ type: 'SET_LOADING', loading: true });
        try {
            await get('/api/isLogin');
            dispatch({ type: SET_OPEN_LOGIN_MODAL, openLoginModal: false });
            dispatch({ type: SET_ISLOGIN, isLogin: true });
        } catch (error: any) {
            dispatch({ type: SET_ERROR, error: error.message });
            dispatch({ type: SET_OPEN_LOGIN_MODAL, openLoginModal: true });
            dispatch({ type: SET_ISLOGIN, isLogin: false });
        }
    }
};

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
    Provider,
    asyncActions
};