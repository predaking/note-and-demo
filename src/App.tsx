import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AddTodo from './components/containers/AddTodo';
import VisibleTodoList from './components/containers/VisibleTodoList';
import Footer from './components/Footer';
import service from './util/service';

import './index.css';

const App = () => {
    return <input type="range" min={0} max={1} step="any"/>;
}

export default App;

/**
 * client.js
 * hook.js 安装hook到全局window，它是一个事件触发器
 */