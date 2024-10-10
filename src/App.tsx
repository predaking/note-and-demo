import React, { useEffect } from 'react';
import webgl from '../webgl';
import Chat from '@/components/chat';
import Register from '@/components/register';

import './index.css';

const App = () => {
    useEffect(() => {
        // webgl.main();
    }, []);

    return (
        <div>
            <Register />
            {/* <Chat /> */}
        </div>
    );
}

export default App;
