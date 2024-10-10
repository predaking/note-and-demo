import React, { useEffect } from 'react';
import webgl from '../webgl';
import Chat from '@/components/chat';
import Register from '@/components/register';
import Demo from './components/demo';

import './index.css';

const App = () => {
    useEffect(() => {
        // webgl.main();
    }, []);

    return (
        <div>
            <Register />
            {/* <Demo /> */}
            {/* <Chat /> */}
        </div>
    );
}

export default App;
