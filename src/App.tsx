import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AddTodo from './components/containers/AddTodo';
import VisibleTodoList from './components/containers/VisibleTodoList';
import Footer from './components/Footer';
import service from './util/service';

import './index.css';

const App = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        // debugger;
    }

    return (
        <div onClick={handleClick} >
            {count}
        </div>
    );
}

export default App;

/**
 * client.js
 * hook.js 安装hook到全局window，它是一个事件触发器
 */