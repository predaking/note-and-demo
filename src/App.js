import React, {
    useState,
    useEffect,
} from 'react';

import {
    Button
} from 'antd';

import './index.css';

// import DemoComponent from './DemoComponent/index.jsx';

export default function App() {

    const [count, setCount] = useState(0);
    const [time, setTime] = useState(0);

    useEffect(() => {
        console.log('effect1');
    }, [count]);

    useEffect(() => {
        console.log('effect2');
    }, [count]);

    useEffect(() => {
        console.log('effect3');
    }, [count]);

    return (
        <div className="container">
            <div className="div-1">按钮</div>
            <div className="div-2">div2</div>
            <div className="div-3">div3</div>
        </div>
    );
}
