import React, { useEffect } from 'react';
import webgl from '../webgl';
import Chat from '@/chat';

console.log('chat: ', Chat);

import './index.css';

const App = () => {
    useEffect(() => {
        // webgl.main();
    }, []);

    return (
        <div>
            <Chat />
        </div>
    );
}

export default App;
