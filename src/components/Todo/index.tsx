import React from "react";
import { TodoProps } from "@/common/interface";

const Todo: React.FC<TodoProps> = ({ text, completed, onClick }) => {
    return (
        <li
            onClick={onClick}
            style={ {
                textDecoration: completed ? 'line-through' : 'none'
            }}
        >
            {text}
        </li>
    );
};

export default Todo;