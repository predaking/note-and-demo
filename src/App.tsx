import { useEffect } from 'react';
import webgl from '../webgl';

import './index.css';

const App = () => {
    useEffect(() => {
        webgl.main();
    }, []);
    return null;
}

export default App;
