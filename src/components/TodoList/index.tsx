import React from 'react';
import Todo from '@/components/Todo';

import { TodoListProps } from '@/common/interface';

const TodoList: React.FC<TodoListProps> = ({ todos, onTodoClick }) => {
    return (
        <ul>
            {
                todos.map((item, index) => (
                    <Todo 
                        key={`${item.text}_${index}`}
                        onClick={() => onTodoClick(index)}
                        text={item.text}
                        completed={item.completed} 
                    />
                ))
            }
        </ul>
    );
}

export default TodoList;