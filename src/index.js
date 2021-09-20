import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
// import Shelf from './Shelf/index.jsx';

// ReactDOM.render(
//     <App />,
//     document.getElementById('app')
// );

ReactDOM.unstable_createRoot(document.getElementById('app')).render(<App />);
