import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AddTodo from './components/containers/AddTodo';
import VisibleTodoList from './components/containers/VisibleTodoList';
import Footer from './components/Footer';
import service from './util/service';
import webgl from '../webgl';

import './index.css';

const App = () => {
    useEffect(() => {
        webgl.main();
    }, []);
    return null;
}

export default App;
