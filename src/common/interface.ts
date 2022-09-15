import { ReactElement } from "react";

export interface TodoProps {
    text: string; // 文案
    completed: boolean; // 完成状态
    onClick?: () => void; // 操作回调,
}

export interface TodoListProps {
    todos: TodoProps[],
    visibilityFilter: string,
    onTodoClick: (index: number) => void
};

export interface LinkProps {
    active: boolean;
    children?: ReactElement;
    filter: string;
    onClick?: () => void;
}