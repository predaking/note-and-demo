import { addTodo } from '@/store/actions';
import React, { useState } from 'react'
import { connect } from 'react-redux';

const AddTodo: any = ({ dispatch }) => {
    const [input, setInput] = useState('');

    const handleSubmit: any = (e: Event) => {
        e.preventDefault();

        if (!input.trim()) {
            return;
        }

        dispatch(addTodo(input));
        setInput('');
    };

    const handleChange: any = (e: Event) => {
        setInput(e?.target?.value);
    }

    return (
        <form
            onSubmit={handleSubmit}
        >
            <input onChange={handleChange} value={input} />
            <input type="submit" value="Add Todo" />
        </form>
    )
}

export default connect()(AddTodo);