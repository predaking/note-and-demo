import { combineReducers } from "redux";
import { ADD_TODO, SET_VISIBILITY_FILTER, TOGGLE_TODO, VisibilityFilters } from "@/common/constant";
import { TodoProps } from "@/common/interface";

const { SHOW_ALL } = VisibilityFilters;

const visibilityFilter = (state = SHOW_ALL, action: any) => {
    switch(action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state;
    }
};

const todos = (state = [], action: any) => {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ];
        case TOGGLE_TODO:
            return state.map((item: TodoProps, index: number) => {
                if (index === action.index) {
                    item.completed = !item.completed
                }
                return item;
            });
        default:
            return state;
    }
};

const todoApp = combineReducers({
    visibilityFilter,
    todos
});

export default todoApp;

