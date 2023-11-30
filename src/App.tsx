import React, { ChangeEvent, useEffect } from 'react';
import webgl from '../webgl';
import Editor from './components/Editor';
import { formUpload } from './service';

import './index.css';

const App = () => {
    useEffect(() => {
        // webgl.main();
    }, []);

    return (
        <div>
            <Editor />
        </div>
    );
}

export default App;
