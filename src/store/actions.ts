import { ADD_TODO, SET_VISIBILITY_FILTER, TOGGLE_TODO } from "@/common/constant"

export const addTodo = (text: string) => {
    return {
        type: ADD_TODO,
        text
    };
};

export const toggleTodo = (index: number) => {
    return {
        type: TOGGLE_TODO,
        index
    };
};

export const setVisibilityFilter = (filter: string) => {
    return {
        type: SET_VISIBILITY_FILTER,
        filter
    };
};