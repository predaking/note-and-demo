import React, { useEffect } from 'react';
import webgl from '../webgl';

import './index.css';

const App = () => {
    useEffect(() => {
        webgl.main();
    }, []);

    return (
        <div>
        </div>
    );
}

export default App;
